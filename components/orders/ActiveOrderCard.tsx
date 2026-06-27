"use client";

import Link from "next/link";
import { currencySymbol } from "@/copy/layout_Copy";
import {
  activeOrdersItemCountSuffix,
  activeOrdersTrackLabel,
  etaMinutesSuffix,
} from "@/copy/storefront_Copy";
import { useDeliveryEta } from "@/hooks/useDeliveryEta";
import { getOrderItemCount, type StoredOrderSummary } from "@/lib/order";

interface ActiveOrderCardProps {
  order: StoredOrderSummary;
}

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
  const minutesLeft = useDeliveryEta(
    order.orderPlacedAt,
    order.estimatedDeliveryMinutes,
    false,
  );
  const itemCount = getOrderItemCount(order);

  return (
    <Link
      href={`/order/${order.orderNumber}`}
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-4 transition-colors hover:border-sabr-green/40 hover:bg-surface-muted"
    >
      <div className="min-w-0">
        <p className="font-semibold text-foreground">
          Order #{order.orderNumber}
        </p>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400">
          {itemCount} {activeOrdersItemCountSuffix} · {currencySymbol}
          {order.total}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums leading-none text-sabr-green">
            {minutesLeft}
          </p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            {etaMinutesSuffix}
          </p>
        </div>
        <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">
          {activeOrdersTrackLabel}
        </span>
      </div>
    </Link>
  );
}
