"use client";

import {
  themeToggleDarkAriaLabel,
  themeToggleLightAriaLabel,
} from "@/copy/layout_Copy";
import { useTheme, useThemeMounted } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const mounted = useThemeMounted();
  const isDark = theme === "dark";

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
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-lg transition-colors hover:bg-gray-200 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
    >
      {mounted ? (isDark ? "☀️" : "🌙") : null}
    </button>
  );
}
