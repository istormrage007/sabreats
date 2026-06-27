"use client";

import { activeOrdersHeading } from "@/copy/storefront_Copy";
import { ActiveOrderCard } from "@/components/orders/ActiveOrderCard";
import { useTrackingOrders } from "@/hooks/useOrders";

export function ActiveOrdersPanel() {
  const orders = useTrackingOrders();

  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold tracking-tight">{activeOrdersHeading}</h2>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.orderNumber}>
            <ActiveOrderCard order={order} />
          </li>
        ))}
      </ul>
    </section>
  );
}
