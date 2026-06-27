import {
  MAX_TRACKABLE_ORDERS,
  ORDER_STORAGE_KEY,
  ORDERS_CHANGED_EVENT,
  ORDERS_STORAGE_KEY,
} from "@/lib/constants";

export type OrderStatus = "tracking" | "delivered";

export interface StoredOrderSummary {
  orderNumber: string;
  orderPlacedAt: number;
  estimatedDeliveryMinutes: number;
  status: OrderStatus;
  subtotal: number;
  priorityDelivery: boolean;
  priorityFee: number;
  tip: number;
  taxTotal: number;
  total: number;
  payloads: {
    itemId: string;
    name: string;
    type: "text" | "riddle";
    payload: string;
    riddleAnswer?: string;
    quantity: number;
  }[];
  lines: { name: string; quantity: number; lineTotal: number }[];
}

let cachedRaw: string | null | undefined;
let cachedOrders: StoredOrderSummary[] | undefined;
let cachedTrackingOrders: StoredOrderSummary[] = [];
let migratedLegacy = false;

const EMPTY_ORDERS: StoredOrderSummary[] = [];

function invalidateCache() {
  cachedRaw = undefined;
  cachedOrders = undefined;
  cachedTrackingOrders = EMPTY_ORDERS;
}

function rebuildTrackingCache(orders: StoredOrderSummary[]): StoredOrderSummary[] {
  cachedTrackingOrders = orders
    .filter((order) => order.status === "tracking")
    .sort((a, b) => b.orderPlacedAt - a.orderPlacedAt)
    .slice(0, MAX_TRACKABLE_ORDERS);
  return cachedTrackingOrders;
}

export function subscribeOrders(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(ORDERS_CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(ORDERS_CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function emitOrdersChanged() {
  window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

function migrateLegacyOrder() {
  if (migratedLegacy || typeof window === "undefined") return;
  migratedLegacy = true;

  const legacy = sessionStorage.getItem(ORDER_STORAGE_KEY);
  if (!legacy) return;

  try {
    const parsed = JSON.parse(legacy) as StoredOrderSummary;
    const orders = parseOrders(localStorage.getItem(ORDERS_STORAGE_KEY));
    if (!orders.some((o) => o.orderNumber === parsed.orderNumber)) {
      const normalized = normalizeOrder({ ...parsed, status: parsed.status ?? "tracking" });
      persistOrders([normalized, ...orders]);
    }
    sessionStorage.removeItem(ORDER_STORAGE_KEY);
  } catch {
    sessionStorage.removeItem(ORDER_STORAGE_KEY);
  }
}

function parseOrders(raw: string | null): StoredOrderSummary[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredOrderSummary[];
    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
  } catch {
    return [];
  }
}

function normalizeOrder(order: StoredOrderSummary): StoredOrderSummary {
  return {
    ...order,
    status: order.status ?? "tracking",
    orderPlacedAt: order.orderPlacedAt ?? Date.now(),
    estimatedDeliveryMinutes: order.estimatedDeliveryMinutes ?? 47,
  };
}

function persistOrders(orders: StoredOrderSummary[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  invalidateCache();
  emitOrdersChanged();
}

export function getAllOrdersSnapshot(): StoredOrderSummary[] {
  if (typeof window === "undefined") return EMPTY_ORDERS;

  migrateLegacyOrder();

  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedOrders ?? EMPTY_ORDERS;
  }

  cachedRaw = raw;
  cachedOrders = parseOrders(raw);
  rebuildTrackingCache(cachedOrders);
  return cachedOrders;
}

export function getTrackingOrdersSnapshot(): StoredOrderSummary[] {
  if (typeof window === "undefined") return EMPTY_ORDERS;

  migrateLegacyOrder();

  const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (raw === cachedRaw) {
    return cachedTrackingOrders;
  }

  getAllOrdersSnapshot();
  return cachedTrackingOrders;
}

export function getOrderByNumberSnapshot(
  orderNumber: string,
): StoredOrderSummary | null {
  return (
    getAllOrdersSnapshot().find((order) => order.orderNumber === orderNumber) ??
    null
  );
}

/** @deprecated Use addOrder */
export function getOrderSummarySnapshot(): StoredOrderSummary | null {
  const tracking = getTrackingOrdersSnapshot();
  return tracking[0] ?? null;
}

export function addOrder(
  summary: Omit<StoredOrderSummary, "status">,
): StoredOrderSummary {
  const order: StoredOrderSummary = normalizeOrder({
    ...summary,
    status: "tracking",
  });

  const existing = getAllOrdersSnapshot().filter(
    (o) => o.orderNumber !== order.orderNumber,
  );
  const tracking = [
    order,
    ...existing.filter((o) => o.status === "tracking"),
  ].slice(0, MAX_TRACKABLE_ORDERS);
  const delivered = existing.filter((o) => o.status === "delivered");
  persistOrders([...tracking, ...delivered]);

  return order;
}

export function markOrderDelivered(orderNumber: string): void {
  const orders = getAllOrdersSnapshot().map((order) =>
    order.orderNumber === orderNumber
      ? { ...order, status: "delivered" as const }
      : order,
  );
  persistOrders(orders);
}

/** @deprecated Use addOrder */
export function saveOrderSummary(summary: StoredOrderSummary): void {
  addOrder(summary);
}

export function loadOrderSummary(): StoredOrderSummary | null {
  return getOrderSummarySnapshot();
}

export function generateOrderNumber(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function getOrderItemCount(order: StoredOrderSummary): number {
  return order.lines.reduce((sum, line) => sum + line.quantity, 0);
}
