"use client";

import { currencySymbol } from "@/copy/layout_Copy";
import { useVerticalCopy } from "@/context/VerticalContext";
import { DEFAULT_TIP_INDEX, TIP_OPTIONS } from "@/lib/constants";

interface TipSelectorProps {
  selectedTip: number;
  onTipChange: (tip: number) => void;
}

export function TipSelector({ selectedTip, onTipChange }: TipSelectorProps) {
  const copy = useVerticalCopy().checkout;

  return (
    <div>
      <p className="mb-3 font-medium">{copy.tipHeading}</p>
      <div className="flex flex-wrap gap-2">
        {TIP_OPTIONS.map((tip, index) => {
          const isSelected = selectedTip === tip;
          const isDefault = index === DEFAULT_TIP_INDEX;
          return (
            <button
              key={tip}
              type="button"
              onClick={() => onTipChange(tip)}
              className={`relative rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-border bg-surface text-foreground hover:border-sabr-gray-500"
              }`}
            >
              {currencySymbol}
              {tip}
              {isDefault && isSelected && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-sabr-green px-2 py-0.5 text-[10px] font-bold text-white">
                  {copy.tipMostCommonBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
