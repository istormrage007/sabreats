"use client";

import dynamic from "next/dynamic";
import { trackingPageTitle } from "@/copy/order_Copy";
import type { StoredOrderSummary } from "@/lib/order";

const LiveTrackingMapClient = dynamic(
  () => import("@/components/reveal/LiveTrackingMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full min-w-0 flex-col gap-3 md:min-h-0 md:flex-1">
        <h1 className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl">
          {trackingPageTitle}
        </h1>
        <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface md:min-h-0 md:flex-1">
          <div className="shrink-0 space-y-3 border-b border-border px-4 py-4 sm:px-5">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
            <div className="h-10 w-24 animate-pulse rounded bg-surface-muted sm:h-12 sm:w-28" />
          </div>
          <div className="flex h-[42dvh] min-h-[200px] items-center justify-center bg-surface-muted text-sm text-gray-500 md:min-h-0 md:flex-1">
            Loading map…
          </div>
        </div>
      </div>
    ),
  },
);

interface LiveTrackingMapProps {
  order: StoredOrderSummary;
  onGiveUp: () => void;
}

export function LiveTrackingMap({ order, onGiveUp }: LiveTrackingMapProps) {
  return <LiveTrackingMapClient order={order} onGiveUp={onGiveUp} />;
}
