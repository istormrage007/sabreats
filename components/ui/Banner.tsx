interface BannerProps {
  headline: string;
  ctaLabel: string;
  onCtaClick?: () => void;
}

export function Banner({ headline, ctaLabel, onCtaClick }: BannerProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-black px-4 py-3 text-white">
      <p className="text-sm font-medium leading-snug">{headline}</p>
      <button
        type="button"
        onClick={onCtaClick}
        className="shrink-0 rounded-full bg-sabr-green px-4 py-1.5 text-xs font-semibold text-white"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
