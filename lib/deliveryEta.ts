import {
  ETA_MINIMUM_MINUTES,
  ETA_PAUSE_BONUS_MINUTES,
  ETA_SECONDS_PER_DISPLAY_MINUTE,
} from "@/lib/constants";

export function getDisplayEtaMinutes(
  orderPlacedAt: number,
  initialMinutes: number,
  isPaused: boolean,
): number {
  const elapsedSec = (Date.now() - orderPlacedAt) / 1000;
  const decrements = Math.floor(elapsedSec / ETA_SECONDS_PER_DISPLAY_MINUTE);
  const pausePenalty = isPaused ? ETA_PAUSE_BONUS_MINUTES : 0;
  return Math.max(
    ETA_MINIMUM_MINUTES,
    initialMinutes + pausePenalty - decrements,
  );
}

export function getEstimatedArrivalTime(
  orderPlacedAt: number,
  displayMinutes: number,
): string {
  const arrival = new Date(orderPlacedAt + displayMinutes * 60 * 1000);
  return arrival.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
