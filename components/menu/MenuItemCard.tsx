"use client";

import Image from "next/image";
import { currencySymbol } from "@/copy/layout_Copy";
import { addButtonLabel, maxQuantityReachedMessage } from "@/copy/storefront_Copy";
import { useCart } from "@/context/CartContext";
import type { MenuItem } from "@/types/menu";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem, isAtMaxQuantity, showCapMessage } = useCart();
  const atMax = isAtMaxQuantity(item.id);

  const handleAdd = () => {
    const added = addItem(item.id);
    if (!added || atMax) {
      showCapMessage(maxQuantityReachedMessage);
    }
  };

  return (
    <article className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
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
            disabled={atMax}
            className="rounded-full bg-sabr-green px-4
            py-1 text-xs font-semibold text-white transition-colors hover:bg-[#05a858] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {addButtonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
