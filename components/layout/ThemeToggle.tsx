"use client";

import {
  themeToggleDarkAriaLabel,
  themeToggleLightAriaLabel,
} from "@/copy/layout_Copy";
import { useTheme, useThemeMounted } from "@/context/ThemeContext";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const mounted = useThemeMounted();
  const isDark = theme === "dark";

  const sizeClass = compact ? "h-9 w-9 text-base" : "h-10 w-10 text-lg";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? themeToggleLightAriaLabel
            : themeToggleDarkAriaLabel
          : themeToggleDarkAriaLabel
      }
      className={`flex shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 transition-colors hover:bg-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 ${sizeClass}`}
    >
      {mounted ? (isDark ? "☀️" : "🌙") : null}
    </button>
  );
}
