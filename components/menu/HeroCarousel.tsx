"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { heroCarouselNextLabel, heroCarouselPrevLabel } from "@/copy/home_Copy";
import type { MastheadSlide } from "@/types/menu";

const ROTATE_MS = 9000;

interface HeroCarouselProps {
  slides: MastheadSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      const next = (index + slides.length) % slides.length;
      setActiveIndex(next);
      setPausedUntil(Date.now() + ROTATE_MS);
    },
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, ROTATE_MS);

    return () => clearInterval(interval);
  }, [slides.length, pausedUntil]);

  if (slides.length === 0) return null;

  const slide = slides[activeIndex]!;

  return (
    <section className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden rounded-2xl">
      {slides.map((s, index) => (
        <Image
          key={s.vertical}
          src={s.imageUrl}
          alt=""
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />

      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <span className="rounded-full bg-sabr-green px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {slide.verticalLabel}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 p-6 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {slide.tagline}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-lg">
          {slide.subtitle}
        </p>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label={heroCarouselPrevLabel}
            onClick={() => goTo(activeIndex - 1)}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white backdrop-blur-sm transition hover:bg-black/65 sm:left-4 sm:h-10 sm:w-10"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label={heroCarouselNextLabel}
            onClick={() => goTo(activeIndex + 1)}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-lg text-white backdrop-blur-sm transition hover:bg-black/65 sm:right-4 sm:h-10 sm:w-10"
          >
            ›
          </button>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:bottom-6 sm:right-6">
            {slides.map((s, index) => (
              <button
                key={s.vertical}
                type="button"
                aria-label={`Show ${s.verticalLabel} masthead`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
