"use client";

import { useVerticalCopy } from "@/context/VerticalContext";
import {
  DELIVERY_PHASE_STEPS,
  isActiveStep,
  isCompletedStep,
  type DeliveryPhase,
  type DeliveryPhaseStep,
} from "@/lib/deliveryPhase";

interface DeliveryPhaseStepperProps {
  phase: DeliveryPhase;
}

export function DeliveryPhaseStepper({ phase }: DeliveryPhaseStepperProps) {
  const copy = useVerticalCopy().order;

  const stepLabels: Record<DeliveryPhaseStep, string> = {
    preparing: copy.deliveryPhasePreparingLabel,
    picked_up: copy.deliveryPhasePickedUpLabel,
    on_the_way: copy.deliveryPhaseOnTheWayLabel,
  };

  return (
    <ol className="flex items-center gap-1">
      {DELIVERY_PHASE_STEPS.map((step, index) => {
        const active = isActiveStep(step, phase);
        const completed = isCompletedStep(step, phase);

        return (
          <li key={step} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-col items-center gap-1.5">
              <span
                className={`flex h-2.5 w-2.5 shrink-0 rounded-full ring-4 transition-colors ${
                  active
                    ? "bg-sabr-green ring-sabr-green/20"
                    : completed
                      ? "bg-sabr-green ring-transparent"
                      : "bg-surface-muted ring-transparent"
                }`}
              />
              <span
                className={`truncate text-center text-[9px] font-medium leading-tight sm:text-xs ${
                  active
                    ? "text-foreground"
                    : completed
                      ? "text-sabr-green"
                      : "text-gray-400 dark:text-zinc-500"
                }`}
              >
                {stepLabels[step]}
              </span>
            </div>
            {index < DELIVERY_PHASE_STEPS.length - 1 && (
              <span
                className={`mb-4 h-px flex-1 ${
                  completed ? "bg-sabr-green" : "bg-surface-muted"
                }`}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
