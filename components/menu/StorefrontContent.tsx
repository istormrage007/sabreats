"use client";

import { categories, menuItems } from "@/data/menu";
import { ActiveOrdersPanel } from "@/components/orders/ActiveOrdersPanel";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { Hero } from "@/components/menu/Hero";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { useCart } from "@/context/CartContext";
import { useMemo, useState } from "react";

export function StorefrontContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { capMessage, clearCapMessage } = useCart();

  const filteredItems = useMemo(() => {
    if (!activeCategory) return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      {capMessage && (
        <div
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-5 py-2 text-sm text-white shadow-lg"
          role="status"
        >
          {capMessage}
          <button
            type="button"
            onClick={clearCapMessage}
            className="ml-3 opacity-70"
          >
            ×
          </button>
        </div>
      )}

      <Hero />
      <ActiveOrdersPanel />
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <MenuGrid items={filteredItems} />
    </div>
  );
}
