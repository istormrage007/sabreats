"use client";

import { useEffect, useState } from "react";
import { DELIVERY_PROGRESS_TICK_MS } from "@/lib/constants";
import { getDeliveryProgress } from "@/lib/deliveryEta";

export function useDeliveryProgress(
  orderPlacedAt: number,
  initialMinutes: number,
): number {
  const [progress, setProgress] = useState(() =>
    getDeliveryProgress(orderPlacedAt, initialMinutes),
  );

  useEffect(() => {
    const tick = () => {
      setProgress(getDeliveryProgress(orderPlacedAt, initialMinutes));
    };
    tick();
    const interval = setInterval(tick, DELIVERY_PROGRESS_TICK_MS);
    return () => clearInterval(interval);
  }, [orderPlacedAt, initialMinutes]);

  return progress;
}
