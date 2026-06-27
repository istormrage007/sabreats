"use client";

import { currencySymbol } from "@/copy/layout_Copy";
import { useVerticalCopy } from "@/context/VerticalContext";
import { lineKey, type CartLineWithDetails } from "@/lib/cart";

interface CheckoutSummaryProps {
  lines: CartLineWithDetails[];
  subtotal: number;
}

export function CheckoutSummary({ lines, subtotal }: CheckoutSummaryProps) {
  const copy = useVerticalCopy().checkout;

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 font-semibold">{copy.orderSummaryHeading}</h2>
      <ul className="space-y-2 text-sm">
        {lines.map((line) => (
          <li
            key={lineKey(line.vertical, line.itemId)}
            className="flex justify-between gap-4"
          >
            <span className="truncate">
              {line.quantity}× {line.item.name}
            </span>
            <span className="shrink-0 font-medium">
              {currencySymbol}
              {line.lineTotal}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
        <span>{copy.subtotalLabel}</span>
        <span>
          {currencySymbol}
          {subtotal}
        </span>
      </div>
    </div>
  );
}
