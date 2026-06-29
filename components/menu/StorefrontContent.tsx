"use client";

import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { ComingSoonVertical } from "@/components/menu/ComingSoonVertical";
import { HeroCarousel } from "@/components/menu/HeroCarousel";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { useCart } from "@/context/CartContext";
import {
  mixedStorefrontSubtitle,
  mixedStorefrontTitle,
} from "@/copy/home_Copy";
import {
  getActiveVerticalConfigs,
  getMastheadSlides,
  getMixedHomeItems,
  getVerticalConfig,
  isVerticalEnabled,
} from "@/lib/verticals";
import type { VerticalId } from "@/types/vertical";
import { useMemo, useState } from "react";

interface StorefrontContentProps {
  vertical?: VerticalId;
}

export function StorefrontContent({ vertical }: StorefrontContentProps) {
  const isMixed = !vertical;

  if (vertical && !isVerticalEnabled(vertical)) {
    return <ComingSoonVertical />;
  }

  const configs = isMixed
    ? getActiveVerticalConfigs()
    : [getVerticalConfig(vertical)];
  const slides = isMixed
    ? getMastheadSlides()
    : getMastheadSlides().filter((s) => s.vertical === vertical);

  const [activeCategories, setActiveCategories] = useState<
    Record<string, string | null>
  >({});

  const { capMessage, clearCapMessage } = useCart();

  const mixedItems = useMemo(() => getMixedHomeItems(), []);

  const sections = useMemo(() => {
    return configs.map((config) => {
      const activeCategory = activeCategories[config.id] ?? null;
      const items = activeCategory
        ? config.catalog.items.filter((item) => item.category === activeCategory)
        : config.catalog.items;
      return {
        vertical: config.id,
        heading: config.copy.storefront.homeSectionHeading,
        categories: config.catalog.categories,
        items,
        activeCategory,
      };
    });
  }, [configs, activeCategories]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-3 py-4 sm:space-y-8 sm:px-4 sm:py-6">
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

      <HeroCarousel slides={slides.length > 0 ? slides : getMastheadSlides()} />

      {isMixed ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {mixedStorefrontTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{mixedStorefrontSubtitle}</p>
          </div>
          <MenuGrid items={mixedItems} />
        </section>
      ) : (
        sections.map((section) => (
          <section key={section.vertical} className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {section.heading}
            </h2>
            <CategoryFilter
              categories={section.categories}
              activeCategory={section.activeCategory}
              onCategoryChange={(category) =>
                setActiveCategories((prev) => ({
                  ...prev,
                  [section.vertical]: category,
                }))
              }
              ariaLabel={
                getVerticalConfig(section.vertical).copy.storefront
                  .categoryFilterAriaLabel
              }
              allLabel={
                getVerticalConfig(section.vertical).copy.storefront.categoryAllLabel
              }
            />
            <MenuGrid items={section.items} />
          </section>
        ))
      )}
    </div>
  );
}
