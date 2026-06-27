"use client";

import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary";
import { EmptyCartState } from "@/components/checkout/EmptyCartState";
import { PriorityDeliveryToggle } from "@/components/checkout/PriorityDeliveryToggle";
import { TaxAccordion } from "@/components/checkout/TaxAccordion";
import { TipSelector } from "@/components/checkout/TipSelector";
import { Button } from "@/components/ui/Button";
import { currencySymbol } from "@/copy/layout_Copy";
import {
  checkoutPageTitle,
  placeOrderButtonLabel,
  totalLabel,
} from "@/copy/checkout_Copy";
import { useCart } from "@/context/CartContext";
import {
  getCartLinesWithDetails,
  getOrderPayloads,
  getOrderTotal,
  getTaxTotal,
} from "@/lib/cart";
import {
  DEFAULT_ESTIMATED_DELIVERY_MINUTES,
  PRIORITY_DELIVERY_FEE,
  PRIORITY_ETA_REDUCTION_MINUTES,
  TIP_OPTIONS,
} from "@/lib/constants";
import { generateOrderNumber, addOrder } from "@/lib/order";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CheckoutContent() {
  const router = useRouter();
  const isClient = useIsClient();
  const { lines, subtotal, clearCart } = useCart();
  const [priorityDelivery, setPriorityDelivery] = useState(true);
  const [selectedTip, setSelectedTip] = useState<number>(TIP_OPTIONS[2]);

  const cartLines = getCartLinesWithDetails(lines);
  const taxTotal = getTaxTotal();
  const total = getOrderTotal(
    subtotal,
    priorityDelivery,
    PRIORITY_DELIVERY_FEE,
    selectedTip,
  );

  if (!isClient) {
    return null;
  }

  if (cartLines.length === 0) {
    return <EmptyCartState />;
  }

  const handlePlaceOrder = () => {
    const orderNumber = generateOrderNumber();
    addOrder({
      orderNumber,
      orderPlacedAt: Date.now(),
      estimatedDeliveryMinutes: priorityDelivery
        ? DEFAULT_ESTIMATED_DELIVERY_MINUTES - PRIORITY_ETA_REDUCTION_MINUTES
        : DEFAULT_ESTIMATED_DELIVERY_MINUTES,
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
    clearCart();
    router.push(`/order/${orderNumber}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold">{checkoutPageTitle}</h1>

      <CheckoutSummary lines={cartLines} subtotal={subtotal} />

      <PriorityDeliveryToggle
        enabled={priorityDelivery}
        onChange={setPriorityDelivery}
      />

      <TipSelector selectedTip={selectedTip} onTipChange={setSelectedTip} />

      <TaxAccordion />

      <div className="flex items-center justify-between text-lg font-bold">
        <span>{totalLabel}</span>
        <span>
          {currencySymbol}
          {total}
        </span>
      </div>

      <Button variant="primary" fullWidth onClick={handlePlaceOrder}>
        {placeOrderButtonLabel}
      </Button>
    </div>
  );
}
