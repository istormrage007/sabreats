"use client";

import { useEffect, useState } from "react";
import { getDisplayEtaMinutes } from "@/lib/deliveryEta";

export function useDeliveryEta(
  orderPlacedAt: number,
  initialMinutes: number,
  isPaused: boolean,
): number {
  const [minutesLeft, setMinutesLeft] = useState(() =>
    getDisplayEtaMinutes(orderPlacedAt, initialMinutes, isPaused),
  );

  useEffect(() => {
    const tick = () => {
      setMinutesLeft(
        getDisplayEtaMinutes(orderPlacedAt, initialMinutes, isPaused),
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [orderPlacedAt, initialMinutes, isPaused]);

  return minutesLeft;
}
