"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConfettiCelebration } from "@/components/ui/ConfettiCelebration";
import { LiveTrackingMap } from "@/components/reveal/LiveTrackingMap";
import { Receipt } from "@/components/reveal/Receipt";
import { VerticalProvider, useVerticalCopy } from "@/context/VerticalContext";
import { useDeliveryExpired } from "@/hooks/useDeliveryEta";
import { useOrder } from "@/hooks/useOrders";
import { MAX_DELIVERY_MINUTES } from "@/lib/constants";
import { getDeliveryDeadlineMs } from "@/lib/deliveryEta";
import { markOrderDelivered } from "@/lib/order";

interface OrderContentProps {
  orderNumber: string;
}

function OrderContentInner({
  orderNumber,
  onGiveUp,
  showReceipt,
  celebrate,
}: {
  orderNumber: string;
  onGiveUp: () => void;
  showReceipt: boolean;
  celebrate: boolean;
}) {
  const order = useOrder(orderNumber)!;
  const copy = useVerticalCopy().order;

  if (showReceipt) {
    return (
      <>
        <ConfettiCelebration active={celebrate} />
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
          <div className="flex justify-end">
            <Link
              href="/"
              className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-foreground hover:underline dark:text-zinc-400"
            >
              {copy.backToMenuLabel}
            </Link>
          </div>
          <Receipt order={order} />
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-1 flex-col px-4 py-3">
      <div className="mb-2 flex shrink-0 justify-end">
        <Link
          href="/profile"
          className="text-sm font-medium text-gray-500 underline-offset-4 hover:text-foreground hover:underline dark:text-zinc-400"
        >
          {copy.backToMenuLabel}
        </Link>
      </div>
      <LiveTrackingMap order={order} onGiveUp={onGiveUp} />
    </div>
  );
}

export function OrderContent({ orderNumber }: OrderContentProps) {
  const router = useRouter();
  const order = useOrder(orderNumber);
  const [showReceipt, setShowReceipt] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const mountedAtRef = useRef<number | null>(null);

  const isTracking = order !== null && order.status === "tracking";
  const expired = useDeliveryExpired(
    order?.orderPlacedAt ?? 0,
    order?.estimatedDeliveryMinutes ?? MAX_DELIVERY_MINUTES,
    isTracking && !showReceipt,
  );

  useEffect(() => {
    if (order !== null && mountedAtRef.current === null) {
      mountedAtRef.current = Date.now();
    }
  }, [order]);

  useEffect(() => {
    if (order === null) {
      router.replace("/");
    }
  }, [order, router]);

  useEffect(() => {
    if (!expired || !order || order.status !== "tracking") return;

    const deadline = getDeliveryDeadlineMs(
      order.orderPlacedAt,
      order.estimatedDeliveryMinutes,
    );
    const mountedAt = mountedAtRef.current ?? Date.now();
    const expiredLive =
      mountedAt <= deadline && Date.now() - deadline < 2500;

    markOrderDelivered(order.orderNumber);
    if (expiredLive) {
      setCelebrate(true);
    }
    setShowReceipt(true);
  }, [expired, order]);

  if (order === null) {
    return null;
  }

  const isReceipt = showReceipt || order.status === "delivered";

  const handleGiveUp = () => {
    markOrderDelivered(order.orderNumber);
    setShowReceipt(true);
  };

  return (
    <VerticalProvider vertical={order.vertical ?? "eats"}>
      <OrderContentInner
        orderNumber={orderNumber}
        onGiveUp={handleGiveUp}
        showReceipt={isReceipt}
        celebrate={celebrate}
      />
    </VerticalProvider>
  );
}
