"use client";

import {
  priorityDeliveryDescription,
  priorityDeliveryLabel,
  priorityDeliveryPriceSuffix,
  priorityOffShamePrimary,
  priorityOffShameSecondary,
} from "@/copy/checkout_Copy";

interface PriorityDeliveryToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function PriorityDeliveryToggle({
  enabled,
  onChange,
}: PriorityDeliveryToggleProps) {
  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${
          enabled ? "border-border" : "animate-pulse border-amber-400 bg-amber-50/50 dark:bg-amber-950/30"
        }`}
      >
        <div className="pr-4">
          <p className="font-medium">
            {priorityDeliveryLabel}{" "}
            <span className="text-gray-500">{priorityDeliveryPriceSuffix}</span>
          </p>
          <p className="mt-0.5 text-sm text-gray-500">
            {priorityDeliveryDescription}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            enabled ? "bg-sabr-green" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              enabled ? "left-5" : "left-0.5"
            }`}
          />
        </button>
      </div>
      {!enabled && (
        <div className="space-y-1 px-1 text-sm">
          <p className="text-amber-800">{priorityOffShamePrimary}</p>
          <p className="text-gray-500">{priorityOffShameSecondary}</p>
        </div>
      )}
    </div>
  );
}
