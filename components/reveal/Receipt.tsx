import { currencySymbol } from "@/copy/layout_Copy";
import {
  receiptDeliveredLabel,
  receiptFooterMessage,
  receiptHeading,
  receiptOrderNumberPrefix,
  receiptPayloadHeading,
  receiptPriorityDeliveryLabel,
  receiptTaxesLabel,
  receiptTipLabel,
  receiptTotalLabel,
  riddleAnswerPrefix,
} from "@/copy/order_Copy";
import type { StoredOrderSummary } from "@/lib/order";

interface ReceiptProps {
  order: StoredOrderSummary;
}

export function Receipt({ order }: ReceiptProps) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl">
      <div className="border-b border-border pb-4 text-center">
        <h2 className="text-2xl font-bold">{receiptHeading}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {receiptOrderNumberPrefix}
          {order.orderNumber}
        </p>
        <p className="mt-1 text-xs text-sabr-green">{receiptDeliveredLabel}</p>
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
            <span>{receiptPriorityDeliveryLabel}</span>
            <span>
              {currencySymbol}
              {order.priorityFee}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{receiptTaxesLabel}</span>
          <span>
            {currencySymbol}
            {order.taxTotal}
          </span>
        </div>
        {order.tip > 0 && (
          <div className="flex justify-between">
            <span>{receiptTipLabel}</span>
            <span>
              {currencySymbol}
              {order.tip}
            </span>
          </div>
        )}
        <div className="flex justify-between pt-2 font-semibold text-foreground">
          <span>{receiptTotalLabel}</span>
          <span>
            {currencySymbol}
            {order.total}
          </span>
        </div>
      </div>

      <div className="py-6">
        <h3 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-500">
          {receiptPayloadHeading}
        </h3>
        <div className="space-y-6">
          {order.payloads.map((item) => (
            <div key={item.itemId} className="text-center">
              <p className="text-lg font-medium leading-relaxed text-foreground">
                &ldquo;{item.payload}&rdquo;
              </p>
              {item.type === "riddle" && item.riddleAnswer && (
                <p className="mt-2 text-sm italic text-gray-500">
                  {riddleAnswerPrefix} {item.riddleAnswer}
                </p>
              )}
              {item.quantity > 1 && (
                <p className="mt-1 text-xs text-gray-400">×{item.quantity}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">{receiptFooterMessage}</p>
    </div>
  );
}
