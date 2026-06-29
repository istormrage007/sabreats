"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  addressPillAriaLabel,
  mobileNavCloseAriaLabel,
  mobileNavDrawerTitle,
  mobileNavProfileLabel,
  navEatsLabel,
  navFlixComingSoonLabel,
  navFlixLabel,
  navHomesLabel,
  navHypeLabel,
} from "@/copy/layout_Copy";
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
      className="mt-0.5 h-4 w-4 shrink-0 text-sabr-green"
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

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileNavLink({
  vertical,
  label,
  href,
  active,
  onNavigate,
}: {
  vertical: VerticalId;
  label: string;
  href: string;
  active: boolean;
  onNavigate: () => void;
}) {
  const enabled = isVerticalEnabled(vertical);

  if (!enabled) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className="flex items-center rounded-xl px-3 py-3 text-base font-medium transition-colors hover:bg-surface-muted"
      >
        <span className="bg-gradient-to-r from-[#5a8fc7] to-[#7eb0e8] bg-clip-text text-transparent dark:from-[#8ab4e0] dark:to-[#b4cff5]">
          {label}
          <sup className="ml-0.5 text-[0.5em] font-normal leading-none">
            {navFlixComingSoonLabel}
          </sup>
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`rounded-xl px-3 py-3 text-base font-medium transition-colors ${
        active
          ? "bg-sabr-green text-white"
          : "text-foreground hover:bg-surface-muted"
      }`}
    >
      {label}
    </Link>
  );
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const pathname = usePathname();
  const addressLabel = useAddressPill();
  const trackingOrders = useTrackingOrders();
  const hasTracking = trackingOrders.length > 0;
  const isProfileActive = pathname === "/profile";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isOpen) return null;

  const isVerticalActive = (href: string) => pathname === href;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label={mobileNavCloseAriaLabel}
      />
      <aside className="relative flex h-full w-[min(100%,280px)] flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-bold">{mobileNavDrawerTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500"
            aria-label={mobileNavCloseAriaLabel}
          >
            ×
          </button>
        </div>

        <div className="border-b border-border px-4 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {addressPillAriaLabel}
          </p>
          <div className="flex gap-2">
            <LocationPinIcon />
            <p className="text-sm font-medium leading-snug text-foreground">
              {addressLabel}
            </p>
          </div>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-2 py-2"
          aria-label="Vertical categories"
        >
          <ul className="space-y-0.5">
            {navItems.map(({ vertical, label, href }) => (
              <li key={vertical}>
                <MobileNavLink
                  vertical={vertical}
                  label={label}
                  href={href}
                  active={isVerticalActive(href)}
                  onNavigate={onClose}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-2">
          <Link
            href="/profile"
            onClick={onClose}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium transition-colors ${
              isProfileActive
                ? "bg-sabr-green text-white"
                : "text-foreground hover:bg-surface-muted"
            }`}
          >
            <ProfileIcon />
            {mobileNavProfileLabel}
            {hasTracking && (
              <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-red-500 ring-2 ring-surface" />
            )}
          </Link>
        </div>
      </aside>
    </div>
  );
}
