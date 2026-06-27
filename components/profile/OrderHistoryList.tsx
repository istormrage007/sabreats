"use client";

import Link from "next/link";
import { currencySymbol } from "@/copy/layout_Copy";
import {
  orderHistoryEmpty,
  orderHistoryLabel,
  orderStatusDelivered,
  orderStatusTracking,
} from "@/copy/profile_Copy";
import { getVerticalConfig } from "@/lib/verticals";
import type { StoredOrderSummary } from "@/lib/order";

interface OrderHistoryListProps {
  orders: StoredOrderSummary[];
}

export function OrderHistoryList({ orders }: OrderHistoryListProps) {
  const sorted = [...orders]
    .filter((order) => order.status === "delivered")
    .sort((a, b) => b.orderPlacedAt - a.orderPlacedAt);

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-xl border border-border bg-surface p-3">
      <h2 className="mb-2 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
        {orderHistoryLabel}
      </h2>
      {sorted.length === 0 ? (
        <p className="text-xs text-gray-500">{orderHistoryEmpty}</p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          {sorted.map((order) => {
            const verticalLabel = getVerticalConfig(order.vertical ?? "eats")
              .copy.storefront.verticalLabel;
            return (
              <li key={order.orderNumber}>
                <Link
                  href={`/order/${order.orderNumber}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border px-2.5 py-2 transition-colors hover:border-sabr-green/40 sm:px-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium sm:text-sm">
                      #{order.orderNumber}
                      <span className="ml-1.5 rounded-full bg-surface-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase">
                        {verticalLabel}
                      </span>
                    </p>
                    <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                      {new Date(order.orderPlacedAt).toLocaleDateString()} ·{" "}
                      {currencySymbol}
                      {order.total}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold sm:text-xs ${
                      order.status === "delivered"
                        ? "text-sabr-green"
                        : "text-amber-600"
                    }`}
                  >
                    {order.status === "delivered"
                      ? orderStatusDelivered
                      : orderStatusTracking}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
