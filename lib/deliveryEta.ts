import {
  ETA_MINIMUM_MINUTES,
  MAX_DELIVERY_MINUTES,
} from "@/lib/constants";

export function getDeliveryDurationMs(initialMinutes: number): number {
  const durationMinutes = Math.min(initialMinutes, MAX_DELIVERY_MINUTES);
  return durationMinutes * 60 * 1000;
}

export function getDeliveryDeadlineMs(
  orderPlacedAt: number,
  initialMinutes: number,
): number {
  return orderPlacedAt + getDeliveryDurationMs(initialMinutes);
}

/** 0 at order placed, 1 when the delivery window ends */
export function getDeliveryProgress(
  orderPlacedAt: number,
  initialMinutes: number,
  now = Date.now(),
): number {
  const durationMs = getDeliveryDurationMs(initialMinutes);
  if (durationMs === 0) return 1;
  const elapsed = now - orderPlacedAt;
  return Math.min(1, Math.max(0, elapsed / durationMs));
}

export function getRemainingDeliveryMs(
  orderPlacedAt: number,
  initialMinutes: number,
): number {
  return Math.max(
    0,
    getDeliveryDeadlineMs(orderPlacedAt, initialMinutes) - Date.now(),
  );
}

export function isDeliveryExpired(
  orderPlacedAt: number,
  initialMinutes: number,
): boolean {
  return getRemainingDeliveryMs(orderPlacedAt, initialMinutes) === 0;
}

export function getDisplayEtaMinutes(
  orderPlacedAt: number,
  initialMinutes: number,
): number {
  const remainingMs = getRemainingDeliveryMs(orderPlacedAt, initialMinutes);
  if (remainingMs === 0) return ETA_MINIMUM_MINUTES;
  return Math.max(ETA_MINIMUM_MINUTES, Math.ceil(remainingMs / 60_000));
}

export function getEstimatedArrivalTime(
  orderPlacedAt: number,
  initialMinutes: number,
): string {
  const arrival = new Date(getDeliveryDeadlineMs(orderPlacedAt, initialMinutes));
  return arrival.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function clampEstimatedDeliveryMinutes(minutes: number): number {
  return Math.max(1, Math.min(minutes, MAX_DELIVERY_MINUTES));
}
