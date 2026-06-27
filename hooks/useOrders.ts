"use client";

import { useSyncExternalStore } from "react";
import {
  getOrderByNumberSnapshot,
  getTrackingOrdersSnapshot,
  subscribeOrders,
  type StoredOrderSummary,
} from "@/lib/order";

const SERVER_TRACKING_ORDERS: StoredOrderSummary[] = [];

export function useTrackingOrders(): StoredOrderSummary[] {
  return useSyncExternalStore(
    subscribeOrders,
    getTrackingOrdersSnapshot,
    () => SERVER_TRACKING_ORDERS,
  );
}

export function useOrder(orderNumber: string): StoredOrderSummary | null {
  return useSyncExternalStore(
    subscribeOrders,
    () => getOrderByNumberSnapshot(orderNumber),
    () => null,
  );
}
