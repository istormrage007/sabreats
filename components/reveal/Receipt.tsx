"use client";

import { currencySymbol } from "@/copy/layout_Copy";
import { useVerticalCopy } from "@/context/VerticalContext";
import type { StoredOrderSummary } from "@/lib/order";

interface ReceiptProps {
  order: StoredOrderSummary;
}

export function Receipt({ order }: ReceiptProps) {
  const copy = useVerticalCopy().order;

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-4 shadow-xl sm:p-6">
      <div className="border-b border-border pb-4 text-center">
        <h2 className="text-2xl font-bold">{copy.receiptHeading}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {copy.receiptOrderNumberPrefix}
          {order.orderNumber}
        </p>
        <p className="mt-1 text-xs text-sabr-green">{copy.receiptDeliveredLabel}</p>
      </div>

      <ul className="space-y-2 border-b border-border py-4 text-sm">
        {order.lines.map((line) => (
          <li key={`${line.name}-${line.quantity}`} className="flex justify-between">
            <span>
              {line.quantity}× {line.name}
            </span>
            <span>
              {currencySymbol}
              {line.lineTotal}
            </span>
          </li>
        ))}
      </ul>

      <div className="space-y-1 border-b border-border py-4 text-sm text-sabr-gray-500">
        {order.priorityDelivery && (
          <div className="flex justify-between">
            <span>{copy.receiptPriorityDeliveryLabel}</span>
            <span>
              {currencySymbol}
              {order.priorityFee}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{copy.receiptTaxesLabel}</span>
          <span>
            {currencySymbol}
            {order.taxTotal}
          </span>
        </div>
        {order.tip > 0 && (
          <div className="flex justify-between">
            <span>{copy.receiptTipLabel}</span>
            <span>
              {currencySymbol}
              {order.tip}
            </span>
          </div>
        )}
        <div className="flex justify-between pt-2 font-semibold text-foreground">
          <span>{copy.receiptTotalLabel}</span>
          <span>
            {currencySymbol}
            {order.total}
          </span>
        </div>
      </div>

      <div className="py-6">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          {copy.receiptPayloadHeading}
        </h3>
        <div className="space-y-6">
          {order.payloads.map((item) => (
            <div key={item.itemId} className="text-center">
              <p className="text-lg font-medium leading-relaxed text-foreground">
                &ldquo;{item.payload}&rdquo;
              </p>
              {item.type === "riddle" && item.riddleAnswer && (
                <p className="mt-2 text-sm italic text-gray-500">
                  {copy.riddleAnswerPrefix} {item.riddleAnswer}
                </p>
              )}
              {item.quantity > 1 && (
                <p className="mt-1 text-xs text-gray-400">×{item.quantity}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">{copy.receiptFooterMessage}</p>
    </div>
  );
}
