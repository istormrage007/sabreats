"use client";

import { useState } from "react";
import { currencySymbol } from "@/copy/layout_Copy";
import {
  serviceFeeLabel,
  smallThoughtFeeLabel,
  taxesAccordionLabel,
} from "@/copy/checkout_Copy";
import { SERVICE_FEE, SMALL_THOUGHT_FEE } from "@/lib/constants";

export function TaxAccordion() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border pb-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between py-2 text-sm font-medium"
      >
        <span>{taxesAccordionLabel}</span>
        <span className="flex items-center gap-2 text-gray-600">
          {currencySymbol}
          {SMALL_THOUGHT_FEE + SERVICE_FEE}
          <span className="text-lg">{expanded ? "▾" : "▸"}</span>
        </span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-2 pl-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{smallThoughtFeeLabel}</span>
            <span>
              {currencySymbol}
              {SMALL_THOUGHT_FEE}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{serviceFeeLabel}</span>
            <span>
              {currencySymbol}
              {SERVICE_FEE}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
