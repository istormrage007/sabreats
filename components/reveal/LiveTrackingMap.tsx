"use client";

import dynamic from "next/dynamic";
import { trackingPageTitle } from "@/copy/order_Copy";
import type { StoredOrderSummary } from "@/lib/order";

const LiveTrackingMapClient = dynamic(
  () => import("@/components/reveal/LiveTrackingMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <h1 className="shrink-0 text-xl font-bold tracking-tight sm:text-2xl">
          {trackingPageTitle}
        </h1>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="shrink-0 space-y-3 border-b border-border px-4 py-4 sm:px-5">
            <div className="h-3 w-20 animate-pulse rounded bg-surface-muted" />
            <div className="h-12 w-28 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center bg-surface-muted text-sm text-gray-500">
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
