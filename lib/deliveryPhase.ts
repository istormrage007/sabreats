export type DeliveryPhase =
  | "locating"
  | "routing"
  | "preparing"
  | "picked_up"
  | "on_the_way";

export type MapPhase = "locating" | "routing" | "driving";

const PREPARING_PROGRESS_MAX = 0.08;
const PICKED_UP_PROGRESS_MAX = 0.18;

export function getDeliveryPhase(
  mapPhase: MapPhase,
  progress: number,
): DeliveryPhase {
  if (mapPhase === "locating") return "locating";
  if (mapPhase === "routing") return "routing";

  if (progress < PREPARING_PROGRESS_MAX) {
    return "preparing";
  }
  if (progress < PICKED_UP_PROGRESS_MAX) {
    return "picked_up";
  }
  return "on_the_way";
}

export const DELIVERY_PHASE_STEPS = [
  "preparing",
  "picked_up",
  "on_the_way",
] as const;

export type DeliveryPhaseStep = (typeof DELIVERY_PHASE_STEPS)[number];

export function isActiveStep(
  step: DeliveryPhaseStep,
  phase: DeliveryPhase,
): boolean {
  if (phase === "preparing" || phase === "locating" || phase === "routing") {
    return step === "preparing";
  }
  if (phase === "picked_up") return step === "picked_up";
  return step === "on_the_way";
}

export function isCompletedStep(
  step: DeliveryPhaseStep,
  phase: DeliveryPhase,
): boolean {
  if (phase === "locating" || phase === "routing") return false;
  if (phase === "preparing") return false;
  if (phase === "picked_up") return step === "preparing";
  if (phase === "on_the_way") {
    return step === "preparing" || step === "picked_up";
  }
  return false;
}
