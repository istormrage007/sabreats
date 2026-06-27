"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useVerticalCopy } from "@/context/VerticalContext";

export function EmptyCartState() {
  const copy = useVerticalCopy().checkout;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl opacity-20">🍽️</div>
      <h1 className="text-2xl font-bold">{copy.emptyCartTitle}</h1>
      <p className="mt-2 max-w-sm text-gray-500">{copy.emptyCartDescription}</p>
      <Link href="/" className="mt-8">
        <Button variant="primary">{copy.emptyCartCtaLabel}</Button>
      </Link>
    </div>
  );
}
