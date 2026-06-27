import { DRIVER_METERS_PER_TICK, ROUTE_PAUSE_PROGRESS } from "@/lib/constants";
import { bearingDegrees, haversineMeters, type LatLng } from "@/lib/geo";

export interface RouteSegment {
  from: LatLng;
  to: LatLng;
  lengthMeters: number;
}

export interface RoutePath {
  points: LatLng[];
  segments: RouteSegment[];
  totalMeters: number;
}

export type RouteAnimationPhase = "moving" | "paused";

export interface RouteAnimationState {
  phase: RouteAnimationPhase;
  distanceMeters: number;
  progress: number;
  position: LatLng;
  bearing: number;
}

export function buildRoutePath(points: LatLng[]): RoutePath {
  if (points.length < 2) {
    return { points, segments: [], totalMeters: 0 };
  }

  const segments: RouteSegment[] = [];
  let totalMeters = 0;

  for (let i = 0; i < points.length - 1; i += 1) {
    const from = points[i];
    const to = points[i + 1];
    const lengthMeters = haversineMeters(from, to);
    segments.push({ from, to, lengthMeters });
    totalMeters += lengthMeters;
  }

  return { points, segments, totalMeters };
}

export function getPositionAtDistance(
  path: RoutePath,
  distanceMeters: number,
): { position: LatLng; bearing: number; progress: number } {
  if (path.totalMeters === 0 || path.points.length === 0) {
    const fallback = path.points[0] ?? { lat: 0, lng: 0 };
    return { position: fallback, bearing: 0, progress: 0 };
  }

  const clamped = Math.max(0, Math.min(distanceMeters, path.totalMeters));
  let remaining = clamped;

  for (const segment of path.segments) {
    if (remaining <= segment.lengthMeters) {
      const t =
        segment.lengthMeters === 0 ? 0 : remaining / segment.lengthMeters;
      return {
        position: {
          lat: segment.from.lat + (segment.to.lat - segment.from.lat) * t,
          lng: segment.from.lng + (segment.to.lng - segment.from.lng) * t,
        },
        bearing: bearingDegrees(segment.from, segment.to),
        progress: clamped / path.totalMeters,
      };
    }
    remaining -= segment.lengthMeters;
  }

  const last = path.points[path.points.length - 1];
  const prev = path.points[path.points.length - 2] ?? last;
  return {
    position: last,
    bearing: bearingDegrees(prev, last),
    progress: 1,
  };
}

export function createInitialAnimationState(
  path: RoutePath,
): RouteAnimationState {
  const { position, bearing, progress } = getPositionAtDistance(path, 0);
  return {
    phase: "moving",
    distanceMeters: 0,
    progress,
    position,
    bearing,
  };
}

export function advanceRouteAnimation(
  state: RouteAnimationState,
  path: RoutePath,
): RouteAnimationState {
  if (path.totalMeters === 0 || state.phase === "paused") {
    return state;
  }

  const pauseDistance = path.totalMeters * ROUTE_PAUSE_PROGRESS;
  const nextDistance = state.distanceMeters + DRIVER_METERS_PER_TICK;

  if (nextDistance >= pauseDistance) {
    const pausedAt = getPositionAtDistance(path, pauseDistance);
    return {
      phase: "paused",
      distanceMeters: pauseDistance,
      progress: pausedAt.progress,
      position: pausedAt.position,
      bearing: pausedAt.bearing,
    };
  }

  const { position, bearing, progress } = getPositionAtDistance(
    path,
    nextDistance,
  );

  return {
    phase: "moving",
    distanceMeters: nextDistance,
    progress,
    position,
    bearing,
  };
}

export function pickRandomSatirePauseMessage(
  messages: readonly string[],
): string {
  return messages[Math.floor(Math.random() * messages.length)] ?? messages[0];
}
