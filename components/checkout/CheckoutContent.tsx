"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { EmptyCartState } from "@/components/checkout/EmptyCartState";
import { PriorityDeliveryToggle } from "@/components/checkout/PriorityDeliveryToggle";
import { TaxAccordion } from "@/components/checkout/TaxAccordion";
import { TipSelector } from "@/components/checkout/TipSelector";
import { Button } from "@/components/ui/Button";
import { VerticalProvider } from "@/context/VerticalContext";
import { currencySymbol } from "@/copy/layout_Copy";
import { useCart } from "@/context/CartContext";
import {
  getCartLinesWithDetails,
  getOrderPayloads,
  getOrderTotal,
  getPrimaryVertical,
  getTaxTotal,
} from "@/lib/cart";
import { clampEstimatedDeliveryMinutes } from "@/lib/deliveryEta";
import {
  DEFAULT_ESTIMATED_DELIVERY_MINUTES,
  PRIORITY_DELIVERY_FEE,
  PRIORITY_ETA_REDUCTION_MINUTES,
  TIP_OPTIONS,
} from "@/lib/constants";
import { generateOrderNumber, addOrder } from "@/lib/order";
import { recordCheckoutAbandoned } from "@/lib/profileStats";
import { useVerticalCopy } from "@/context/VerticalContext";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function CheckoutInner() {
  const router = useRouter();
  const copy = useVerticalCopy().checkout;
  const { lines, subtotal, clearCart } = useCart();
  const [priorityDelivery, setPriorityDelivery] = useState(true);
  const [selectedTip, setSelectedTip] = useState<number>(TIP_OPTIONS[2]);
  const hadItems = useRef(false);

  const cartLines = getCartLinesWithDetails(lines);
  const taxTotal = getTaxTotal();
  const total = getOrderTotal(
    subtotal,
    priorityDelivery,
    PRIORITY_DELIVERY_FEE,
    selectedTip,
  );

  useEffect(() => {
    if (cartLines.length > 0) {
      hadItems.current = true;
    }
  }, [cartLines.length]);

  useEffect(() => {
    return () => {
      if (hadItems.current && cartLines.length > 0) {
        recordCheckoutAbandoned();
      }
    };
  }, [cartLines.length]);

  if (cartLines.length === 0) {
    return <EmptyCartState />;
  }

  const handlePlaceOrder = () => {
    const orderNumber = generateOrderNumber();
    const vertical = getPrimaryVertical(lines);
    addOrder({
      orderNumber,
      orderPlacedAt: Date.now(),
      vertical,
      estimatedDeliveryMinutes: clampEstimatedDeliveryMinutes(
        priorityDelivery
          ? DEFAULT_ESTIMATED_DELIVERY_MINUTES - PRIORITY_ETA_REDUCTION_MINUTES
          : DEFAULT_ESTIMATED_DELIVERY_MINUTES,
      ),
      subtotal,
      priorityDelivery,
      priorityFee: PRIORITY_DELIVERY_FEE,
      tip: selectedTip,
      taxTotal,
      total,
      payloads: getOrderPayloads(lines),
      lines: cartLines.map((line) => ({
        name: line.item.name,
        quantity: line.quantity,
        lineTotal: line.lineTotal,
      })),
    });
    hadItems.current = false;
    clearCart();
    router.push(`/order/${orderNumber}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-5 px-3 py-6 sm:space-y-6 sm:px-4 sm:py-8">
      <h1 className="text-xl font-bold sm:text-2xl">{copy.checkoutPageTitle}</h1>

      <CheckoutSummary lines={cartLines} subtotal={subtotal} />

      <PriorityDeliveryToggle
        enabled={priorityDelivery}
        onChange={setPriorityDelivery}
      />

      <TipSelector selectedTip={selectedTip} onTipChange={setSelectedTip} />

      <TaxAccordion />

      <div className="flex items-center justify-between text-lg font-bold">
        <span>{copy.totalLabel}</span>
        <span>
          {currencySymbol}
          {total}
        </span>
      </div>

      <Button variant="primary" fullWidth onClick={handlePlaceOrder}>
        {copy.placeOrderButtonLabel}
      </Button>
    </div>
  );
}

export function CheckoutContent() {
  const isClient = useIsClient();
  const { lines } = useCart();
  const vertical = getPrimaryVertical(lines);

  if (!isClient) {
    return null;
  }

  return (
    <VerticalProvider vertical={vertical}>
      <CheckoutInner />
    </VerticalProvider>
  );
}
