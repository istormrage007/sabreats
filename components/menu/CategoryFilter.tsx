"use client";

import { categoryAllLabel, categoryFilterAriaLabel } from "@/copy/storefront_Copy";
import type { Category } from "@/types/menu";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      role="tablist"
      aria-label={categoryFilterAriaLabel}
    >
      <FilterChip
        label={categoryAllLabel}
        isActive={activeCategory === null}
        onClick={() => onCategoryChange(null)}
      />
      {categories.map((category) => (
        <FilterChip
          key={category.id}
          label={category.label}
          isActive={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-surface-muted text-foreground hover:bg-border"
      }`}
    >
      {label}
    </button>
  );
}
