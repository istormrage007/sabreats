"use client";

import Link from "next/link";
import { currencySymbol } from "@/copy/layout_Copy";
import { activeOrdersTrackLabel } from "@/copy/eats/storefront_Copy";
import { getVerticalConfig } from "@/lib/verticals";
import { useDeliveryEta } from "@/hooks/useDeliveryEta";
import { getOrderItemCount, type StoredOrderSummary } from "@/lib/order";

interface ActiveOrderCardProps {
  order: StoredOrderSummary;
}

export function ActiveOrderCard({ order }: ActiveOrderCardProps) {
  const minutesLeft = useDeliveryEta(
    order.orderPlacedAt,
    order.estimatedDeliveryMinutes,
  );
  const itemCount = getOrderItemCount(order);
  const verticalCopy = getVerticalConfig(order.vertical ?? "eats").copy.storefront;

  return (
    <Link
      href={`/order/${order.orderNumber}`}
      className="flex flex-col gap-2.5 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-sabr-green/40 hover:bg-surface-muted sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">
          Order #{order.orderNumber}
          <span className="ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold uppercase">
            {verticalCopy.verticalLabel}
          </span>
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-zinc-400">
          {itemCount} {verticalCopy.activeOrdersItemCountSuffix} · {currencySymbol}
          {order.total}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 sm:shrink-0 sm:justify-end sm:gap-3">
        <div className="text-left sm:text-right">
          <p className="text-xl font-bold tabular-nums leading-none text-sabr-green sm:text-2xl">
            {minutesLeft}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-zinc-400 sm:text-xs">
            {verticalCopy.etaMinutesSuffix}
          </p>
        </div>
        <span className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-black sm:px-4 sm:py-2 sm:text-sm">
          {activeOrdersTrackLabel}
        </span>
      </div>
    </Link>
  );
}
