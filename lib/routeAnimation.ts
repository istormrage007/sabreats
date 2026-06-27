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

export interface RouteAnimationState {
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

/** Map delivery timeline progress (0–1) to a position along the route */
export function getAnimationStateAtProgress(
  path: RoutePath,
  timelineProgress: number,
): RouteAnimationState {
  const clamped = Math.min(1, Math.max(0, timelineProgress));
  const distanceMeters = path.totalMeters * clamped;
  const { position, bearing, progress } = getPositionAtDistance(
    path,
    distanceMeters,
  );

  return {
    distanceMeters,
    progress,
    position,
    bearing,
  };
}
