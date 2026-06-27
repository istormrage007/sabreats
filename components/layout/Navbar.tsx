"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  addressPillAriaLabel,
  cartButtonAriaLabel,
  cartButtonLabel,
  logoText,
} from "@/copy/layout_Copy";
import { useCart } from "@/context/CartContext";
import { useAddressPill } from "@/hooks/useAddressPill";

export function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const addressLabel = useAddressPill();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-foreground"
        >
          {logoText}
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={addressPillAriaLabel}
            title={addressLabel}
            className="max-w-[120px] truncate rounded-full bg-surface-muted px-4 py-2.5 text-sm font-medium text-foreground sm:max-w-xs sm:px-5"
          >
            {addressLabel}
          </button>

          <ThemeToggle />

          <button
            type="button"
            onClick={openDrawer}
            aria-label={cartButtonAriaLabel}
            className="relative shrink-0 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            {cartButtonLabel}
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sabr-green px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
