"use client";

import { useEffect, useState } from "react";
import {
  getDisplayEtaMinutes,
  isDeliveryExpired,
} from "@/lib/deliveryEta";

export function useDeliveryEta(
  orderPlacedAt: number,
  initialMinutes: number,
): number {
  const [minutesLeft, setMinutesLeft] = useState(() =>
    getDisplayEtaMinutes(orderPlacedAt, initialMinutes),
  );

  useEffect(() => {
    const tick = () => {
      setMinutesLeft(getDisplayEtaMinutes(orderPlacedAt, initialMinutes));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [orderPlacedAt, initialMinutes]);

  return minutesLeft;
}

export function useDeliveryExpired(
  orderPlacedAt: number,
  initialMinutes: number,
  enabled: boolean,
): boolean {
  const [expired, setExpired] = useState(() =>
    enabled ? isDeliveryExpired(orderPlacedAt, initialMinutes) : false,
  );

  useEffect(() => {
    if (!enabled) {
      setExpired(false);
      return;
    }
    const tick = () => {
      setExpired(isDeliveryExpired(orderPlacedAt, initialMinutes));
    };
    tick();
    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [orderPlacedAt, initialMinutes, enabled]);

  return expired;
}
