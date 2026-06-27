"use client";

import { activeOrdersHeading } from "@/copy/eats/storefront_Copy";
import { ActiveOrderCard } from "@/components/orders/ActiveOrderCard";
import { useTrackingOrders } from "@/hooks/useOrders";

export function ActiveOrdersPanel() {
  const orders = useTrackingOrders();

  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="shrink-0 space-y-1.5">
      <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 sm:text-sm">
        {activeOrdersHeading}
      </h2>
      <ul className="space-y-1.5">
        {orders.map((order) => (
          <li key={order.orderNumber}>
            <ActiveOrderCard order={order} />
          </li>
        ))}
      </ul>
    </section>
  );
}
