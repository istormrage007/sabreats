"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import {
  addressPillAriaLabel,
  cartButtonAriaLabel,
  cartButtonLabel,
  logoText,
  navEatsLabel,
  navFlixComingSoonLabel,
  navFlixLabel,
  navHomesLabel,
  navHypeLabel,
  navProfileAriaLabel,
  navProfileTrackingAriaLabel,
} from "@/copy/layout_Copy";
import { useCart } from "@/context/CartContext";
import { useAddressPill } from "@/hooks/useAddressPill";
import { useTrackingOrders } from "@/hooks/useOrders";
import { isVerticalEnabled } from "@/lib/verticals";
import type { VerticalId } from "@/types/vertical";

const navItems: {
  vertical: VerticalId;
  label: string;
  href: string;
}[] = [
  { vertical: "eats", label: navEatsLabel, href: "/eats" },
  { vertical: "hype", label: navHypeLabel, href: "/hype" },
  { vertical: "homes", label: navHomesLabel, href: "/homes" },
  { vertical: "flix", label: navFlixLabel, href: "/flix" },
];

function LocationPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-3.5 w-3.5 shrink-0 text-sabr-green"
      fill="currentColor"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  );
}

function ProfileLink({ className }: { className: string }) {
  const trackingOrders = useTrackingOrders();
  const hasTracking = trackingOrders.length > 0;

  return (
    <Link
      href="/profile"
      aria-label={
        hasTracking ? navProfileTrackingAriaLabel : navProfileAriaLabel
      }
      className={`relative flex items-center justify-center ${className}`}
    >
      <ProfileIcon />
      {hasTracking && (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-surface" />
      )}
    </Link>
  );
}

function NavVerticalItem({
  vertical,
  label,
  href,
  active,
  compact,
}: {
  vertical: VerticalId;
  label: string;
  href: string;
  active: boolean;
  compact?: boolean;
}) {
  const enabled = isVerticalEnabled(vertical);
  const baseClass = compact
    ? "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
    : "rounded-full px-3 py-1.5 text-sm font-medium";

  if (!enabled) {
    return (
      <Link
        href={href}
        className={`${baseClass} bg-gradient-to-r from-[#5a8fc7] to-[#7eb0e8] bg-clip-text text-transparent transition-opacity hover:opacity-80 dark:from-[#8ab4e0] dark:to-[#b4cff5]`}
      >
        {label}
        <sup className="ml-0.5 text-[0.5em] font-normal leading-none">
          {navFlixComingSoonLabel}
        </sup>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${baseClass} transition-colors ${
        active
          ? "bg-foreground text-background"
          : compact
            ? "bg-surface-muted text-gray-500 dark:text-zinc-400"
            : "text-gray-500 hover:text-foreground dark:text-zinc-400"
      }`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const addressLabel = useAddressPill();
  const pathname = usePathname();

  const isVerticalActive = (href: string) => pathname === href;
  const isProfileActive = pathname === "/profile";

  const profileClass = (active: boolean) =>
    active
      ? "bg-sabr-green text-white"
      : "bg-surface-muted text-foreground hover:bg-surface-muted/80";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-tight text-foreground"
          >
            {logoText}
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Vertical categories"
          >
            {navItems.map(({ vertical, label, href }) => (
              <NavVerticalItem
                key={vertical}
                vertical={vertical}
                label={label}
                href={href}
                active={isVerticalActive(href)}
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label={addressPillAriaLabel}
              title={addressLabel}
              className="flex max-w-[140px] items-center gap-1.5 truncate rounded-full bg-surface-muted px-3 py-2.5 text-[0.8125rem] font-medium text-foreground sm:max-w-xs sm:px-4"
            >
              <LocationPinIcon />
              <span className="truncate">{addressLabel}</span>
            </button>

            <ProfileLink
              className={`hidden h-10 w-10 rounded-full sm:inline-flex ${profileClass(isProfileActive)}`}
            />

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

        <nav
          className="flex gap-1 overflow-x-auto pb-0.5 md:hidden"
          aria-label="Vertical categories"
        >
          {navItems.map(({ vertical, label, href }) => (
            <NavVerticalItem
              key={vertical}
              vertical={vertical}
              label={label}
              href={href}
              active={isVerticalActive(href)}
              compact
            />
          ))}
          <ProfileLink
            className={`h-8 w-8 shrink-0 rounded-full ${profileClass(isProfileActive)}`}
          />
        </nav>
      </div>
    </header>
  );
}
