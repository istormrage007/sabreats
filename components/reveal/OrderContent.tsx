"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LiveTrackingMap } from "@/components/reveal/LiveTrackingMap";
import { Receipt } from "@/components/reveal/Receipt";
import { backToMenuLabel } from "@/copy/order_Copy";
import { useOrder } from "@/hooks/useOrders";
import { markOrderDelivered } from "@/lib/order";

interface OrderContentProps {
  orderNumber: string;
}

export function OrderContent({ orderNumber }: OrderContentProps) {
  const router = useRouter();
  const order = useOrder(orderNumber);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    if (order === null) {
      router.replace("/");
    }
  }, [order, router]);

  if (order === null) {
    return null;
  }

  const isReceipt = showReceipt || order.status === "delivered";

  const handleGiveUp = () => {
    markOrderDelivered(order.orderNumber);
    setShowReceipt(true);
  };

  if (isReceipt) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex justify-end">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-foreground hover:underline dark:text-zinc-400"
          >
            {backToMenuLabel}
          </Link>
        </div>
        <Receipt order={order} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-0 flex-1 max-w-3xl flex-col px-4 py-3">
      <div className="mb-2 flex shrink-0 justify-end">
        <Link
          href="/"
          className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-foreground hover:underline dark:text-zinc-400"
        >
          {backToMenuLabel}
        </Link>
      </div>
      <LiveTrackingMap order={order} onGiveUp={handleGiveUp} />
    </div>
  );
}
