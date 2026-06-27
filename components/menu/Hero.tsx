import Image from "next/image";
import { heroSubtitle, heroTagline } from "@/copy/storefront_Copy";

const heroImageUrl =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80";

export function Hero() {
  return (
    <section className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden rounded-2xl">
      <Image
        src={heroImageUrl}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {heroTagline}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-white/90 sm:text-lg">
          {heroSubtitle}
        </p>
      </div>
    </section>
  );
}
