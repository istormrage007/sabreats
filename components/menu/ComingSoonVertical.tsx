import {
  flixComingSoonSubtitle,
  flixComingSoonTitle,
} from "@/copy/home_Copy";
import { navFlixComingSoonLabel } from "@/copy/layout_Copy";

export function ComingSoonVertical() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {navFlixComingSoonLabel}
      </span>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">{flixComingSoonTitle}</h1>
      <p className="mt-3 text-gray-500">{flixComingSoonSubtitle}</p>
    </div>
  );
}
