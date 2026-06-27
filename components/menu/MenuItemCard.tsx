"use client";

import Image from "next/image";
import { currencySymbol } from "@/copy/layout_Copy";
import { getVerticalConfig, isVerticalEnabled } from "@/lib/verticals";
import { useCart } from "@/context/CartContext";
import type { MenuItem } from "@/types/menu";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, isAtMaxQuantity, showCapMessage } = useCart();
  const verticalCopy = getVerticalConfig(item.vertical).copy.storefront;
  const atMax = isAtMaxQuantity(item.vertical, item.id);
  const [imageError, setImageError] = useState(false);

  const enabled = isVerticalEnabled(item.vertical);

  const handleAdd = () => {
    if (!enabled) return;
    const added = addItem(item.vertical, item.id);
    if (!added || atMax) {
      showCapMessage(verticalCopy.maxQuantityReachedMessage);
    }
  };

  return (
    <article className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-muted">
        {!imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {verticalCopy.verticalLabel}
        </span>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 className="text-base font-semibold leading-tight text-foreground">
          {item.name}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-500">{item.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-foreground">
            {currencySymbol}
            {item.price}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={atMax || !enabled}
            className="rounded-full bg-sabr-green px-4 py-1 text-xs font-semibold text-white transition-colors hover:bg-[#05a858] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {verticalCopy.addButtonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
