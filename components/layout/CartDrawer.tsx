"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { currencySymbol } from "@/copy/layout_Copy";
import { useCart } from "@/context/CartContext";
import { getCartLinesWithDetails, getPrimaryVertical, lineKey } from "@/lib/cart";
import { getVerticalCopy } from "@/lib/verticals";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";

export function CartDrawer() {
  const router = useRouter();
  const {
    lines,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    subtotal,
    capMessage,
    clearCapMessage,
    showCapMessage,
  } = useCart();

  const cartLines = getCartLinesWithDetails(lines);
  const isEmpty = cartLines.length === 0;
  const primaryVertical = getPrimaryVertical(lines);
  const copy = getVerticalCopy(isEmpty ? "eats" : primaryVertical).cartDrawer;

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!capMessage) return;
    const timer = setTimeout(clearCapMessage, 3000);
    return () => clearTimeout(timer);
  }, [capMessage, clearCapMessage]);

  if (!isDrawerOpen) return null;

  const handleIncrease = (
    vertical: typeof primaryVertical,
    itemId: string,
    currentQty: number,
  ) => {
    if (currentQty >= MAX_QUANTITY_PER_ITEM) {
      const msg = getVerticalCopy(vertical).storefront.maxQuantityReachedMessage;
      showCapMessage(msg);
      return;
    }
    setQuantity(vertical, itemId, currentQty + 1);
  };

  const handleCheckout = () => {
    if (isEmpty) return;
    closeDrawer();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={closeDrawer}
        aria-label={copy.cartDrawerCloseAriaLabel}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-surface shadow-2xl sm:w-[400px]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">{copy.cartDrawerTitle}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-2xl leading-none text-gray-500"
            aria-label={copy.cartDrawerCloseAriaLabel}
          >
            ×
          </button>
        </div>

        <Banner headline={copy.sabrOneBannerHeadline} ctaLabel={copy.sabrOneBannerCta} />

        {capMessage && (
          <p className="bg-amber-50 px-5 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {capMessage}
          </p>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 text-6xl opacity-30">🛒</div>
              <p className="text-lg font-semibold">{copy.cartEmptyMessage}</p>
              <p className="mt-1 text-sm text-gray-500">{copy.cartEmptySubtext}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cartLines.map((line) => (
                <li
                  key={lineKey(line.vertical, line.itemId)}
                  className="flex items-start justify-between gap-3 border-b border-border pb-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{line.item.name}</p>
                    <p className="text-sm text-gray-500">
                      {currencySymbol}
                      {line.item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={copy.quantityDecreaseAriaLabel}
                      onClick={() =>
                        setQuantity(line.vertical, line.itemId, line.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={copy.quantityIncreaseAriaLabel}
                      onClick={() =>
                        handleIncrease(line.vertical, line.itemId, line.quantity)
                      }
                      disabled={line.quantity >= MAX_QUANTITY_PER_ITEM}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-lg disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border px-5 py-4">
          {!isEmpty && (
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-gray-600">{copy.subtotalLabel}</span>
              <span className="font-semibold">
                {currencySymbol}
                {subtotal}
              </span>
            </div>
          )}
          <Button
            variant="secondary"
            fullWidth
            disabled={isEmpty}
            onClick={handleCheckout}
          >
            {copy.checkoutCtaLabel}
          </Button>
        </div>
      </aside>
    </div>
  );
}
