"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Button } from "@/components/ui/Button";
import { DeliveryPhaseStepper } from "@/components/reveal/DeliveryPhaseStepper";
import {
  CARTO_DARK_TILE_URL,
  CARTO_LIGHT_TILE_URL,
  CARTO_TILE_ATTRIBUTION,
} from "@/lib/constants";
import { useTheme } from "@/context/ThemeContext";
import { useVerticalCopy } from "@/context/VerticalContext";
import { useDeliveryEta } from "@/hooks/useDeliveryEta";
import { useDeliveryProgress } from "@/hooks/useDeliveryProgress";
import { useGeolocation } from "@/hooks/useGeolocation";
import { getEstimatedArrivalTime } from "@/lib/deliveryEta";
import { getDeliveryPhase } from "@/lib/deliveryPhase";
import { generateStablePickupOffset, type LatLng } from "@/lib/geo";
import type { StoredOrderSummary } from "@/lib/order";
import { fetchOsrmRoute } from "@/lib/routing";
import {
  buildRoutePath,
  getAnimationStateAtProgress,
  type RoutePath,
} from "@/lib/routeAnimation";

interface LiveTrackingMapClientProps {
  order: StoredOrderSummary;
  onGiveUp: () => void;
}

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(
      points.map((p) => [p.lat, p.lng] as [number, number]),
    );
    map.fitBounds(bounds, { padding: [56, 56] });
  }, [map, points]);

  return null;
}

function MapInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize();
    };

    invalidate();
    const raf = requestAnimationFrame(invalidate);
    const timeout = window.setTimeout(invalidate, 150);

    window.addEventListener("resize", invalidate);

    const container = map.getContainer().parentElement;
    const observer =
      container &&
      new ResizeObserver(() => {
        invalidate();
      });
    if (observer && container) {
      observer.observe(container);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      window.removeEventListener("resize", invalidate);
      observer?.disconnect();
    };
  }, [map]);

  return null;
}

function createDriverIcon(bearing: number) {
  return L.divIcon({
    className: "driver-marker-icon",
    html: `<div class="driver-marker" style="transform: rotate(${bearing}deg)">🛵</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

const pickupIcon = L.divIcon({
  className: "driver-marker-icon",
  html: `<div class="pin-marker pin-marker--pickup">S</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const deliveryIcon = L.divIcon({
  className: "driver-marker-icon",
  html: `<div class="pin-marker pin-marker--delivery">Y</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function LiveTrackingMapClient({
  order,
  onGiveUp,
}: LiveTrackingMapClientProps) {
  const copy = useVerticalCopy().order;
  const geo = useGeolocation();
  const { theme } = useTheme();
  const tileUrl =
    theme === "dark" ? CARTO_DARK_TILE_URL : CARTO_LIGHT_TILE_URL;

  const orderPlacedAt = order.orderPlacedAt;
  const initialEta = order.estimatedDeliveryMinutes;
  const orderNumber = order.orderNumber;

  const delivery = geo.status === "loading" ? null : geo.position;
  const pickup = useMemo(
    () => (delivery ? generateStablePickupOffset(delivery) : null),
    [delivery],
  );

  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [routePath, setRoutePath] = useState<RoutePath | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [phaseTick, setPhaseTick] = useState(0);

  const deliveryProgress = useDeliveryProgress(orderPlacedAt, initialEta);
  const minutesLeft = useDeliveryEta(orderPlacedAt, initialEta);
  const arrivalTime = getEstimatedArrivalTime(orderPlacedAt, initialEta);

  const mapPhase =
    geo.status === "loading"
      ? "locating"
      : routePath === null
        ? "routing"
        : "driving";

  const animation = useMemo(
    () =>
      routePath
        ? getAnimationStateAtProgress(routePath, deliveryProgress)
        : null,
    [routePath, deliveryProgress],
  );

  const deliveryPhase = getDeliveryPhase(mapPhase, deliveryProgress);

  useEffect(() => {
    if (!pickup || !delivery) return;

    let cancelled = false;

    fetchOsrmRoute(pickup, delivery).then((points) => {
      if (cancelled) return;
      const path = buildRoutePath(points);
      setRoutePoints(points);
      setRoutePath(path);
    });

    return () => {
      cancelled = true;
    };
  }, [pickup, delivery]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseTick((prev) => prev + 1);
    }, 10_000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (deliveryPhase !== "on_the_way") return;

    const interval = setInterval(() => {
      setStatusIndex(
        (prev) => (prev + 1) % copy.deliveryPhaseOnTheWayMessages.length,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [deliveryPhase, copy.deliveryPhaseOnTheWayMessages.length]);

  const phaseHeadline = useMemo(() => {
    switch (deliveryPhase) {
      case "locating":
      case "routing":
      case "preparing":
        return copy.deliveryPhasePreparingLabel;
      case "picked_up":
        return copy.deliveryPhasePickedUpLabel;
      case "on_the_way":
        return copy.deliveryPhaseOnTheWayLabel;
    }
  }, [deliveryPhase, phaseTick, copy]);

  const phaseDetail = useMemo(() => {
    switch (deliveryPhase) {
      case "locating":
        return copy.locationLoadingMessage;
      case "routing":
        return copy.routingLoadingMessage;
      case "preparing":
        return copy.deliveryPhasePreparingDetail;
      case "picked_up":
        return copy.deliveryPhasePickedUpDetail;
      case "on_the_way":
        return copy.deliveryPhaseOnTheWayMessages[statusIndex];
    }
  }, [deliveryPhase, statusIndex, phaseTick, copy]);

  const progressBarWidth = deliveryProgress * 100;

  const mapCenter = delivery ?? { lat: 28.6129, lng: 77.2295 };
  const boundsPoints =
    routePoints.length > 0 ? routePoints : delivery ? [delivery] : [];

  const driverIcon = animation
    ? createDriverIcon(animation.bearing)
    : createDriverIcon(0);

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 items-baseline justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {copy.trackingPageTitle}
        </h1>
        <p className="shrink-0 text-xs font-medium text-gray-500 dark:text-zinc-400">
          {copy.receiptOrderNumberPrefix}
          {orderNumber}
        </p>
      </div>

      {geo.usedFallback && geo.status !== "loading" && (
        <p className="shrink-0 text-sm text-gray-500 dark:text-zinc-400">
          {copy.locationDeniedMessage}
        </p>
      )}

      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        <div className="min-w-0 shrink-0 border-b border-border px-4 py-4 sm:px-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                {copy.etaLabel}
              </p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="inline-flex w-[2.5ch] shrink-0 justify-start text-4xl font-bold tabular-nums tracking-tight text-foreground sm:text-5xl">
                  {minutesLeft}
                </span>
                <span className="shrink-0 text-base font-medium text-gray-500 dark:text-zinc-400 sm:text-lg">
                  {copy.etaMinutesSuffix}
                </span>
              </p>
            </div>
            <div className="shrink-0 pb-1 text-right">
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {copy.estimatedArrivalLabel}
              </p>
              <p className="text-sm font-semibold tabular-nums text-foreground">
                {arrivalTime}
              </p>
            </div>
          </div>

          <div className="mt-3 min-w-0">
            <DeliveryPhaseStepper phase={deliveryPhase} />
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-sabr-green transition-[width] duration-300 ease-linear"
              style={{ width: `${progressBarWidth}%` }}
            />
          </div>

          <p className="mt-2.5 min-h-[2.5rem] min-w-0 text-sm leading-snug text-gray-500 line-clamp-2 dark:text-zinc-400">
            <span className="font-medium text-foreground">{phaseHeadline}</span>
            <span className="mx-1.5 text-gray-300 dark:text-zinc-600">·</span>
            {phaseDetail}
          </p>
        </div>

        <div className="relative min-h-48 min-w-0 flex-1">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={14}
            className="absolute inset-0 z-0 h-full w-full"
            zoomControl={false}
            attributionControl
          >
            <MapInvalidateSize />
            <TileLayer
              key={theme}
              url={tileUrl}
              attribution={CARTO_TILE_ATTRIBUTION}
            />

            {boundsPoints.length >= 2 && <FitBounds points={boundsPoints} />}

            {routePoints.length >= 2 && (
              <Polyline
                positions={routePoints.map(
                  (p) => [p.lat, p.lng] as [number, number],
                )}
                pathOptions={{ color: "#06C167", weight: 4, opacity: 0.9 }}
              />
            )}

            {pickup && (
              <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
            )}

            {delivery && (
              <Marker
                position={[delivery.lat, delivery.lng]}
                icon={deliveryIcon}
              />
            )}

            {animation && mapPhase === "driving" && (
              <Marker
                position={[animation.position.lat, animation.position.lng]}
                icon={driverIcon}
                zIndexOffset={1000}
              />
            )}
          </MapContainer>

          {(mapPhase === "locating" || mapPhase === "routing") && (
            <div className="absolute inset-0 z-[999] flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
              <p className="rounded-full border border-border bg-surface/90 px-4 py-2 text-sm text-gray-600 shadow-sm dark:text-zinc-300">
                {phaseDetail}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 pb-1 pt-1">
        <Button variant="primary" fullWidth onClick={onGiveUp}>
          {copy.giveUpButtonLabel}
        </Button>
      </div>
    </div>
  );
}
