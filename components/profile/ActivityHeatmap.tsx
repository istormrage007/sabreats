"use client";

import {
  activityHeatmapLabel,
  activityHeatmapLess,
  activityHeatmapMore,
} from "@/copy/profile_Copy";
import { buildActivityByDay } from "@/lib/profileStats";
import type { StoredOrderSummary } from "@/lib/order";

interface ActivityHeatmapProps {
  orders: StoredOrderSummary[];
}

const WEEKS = 16;

export function ActivityHeatmap({ orders }: ActivityHeatmapProps) {
  const activity = buildActivityByDay(orders);
  const today = new Date();
  const days: { date: string; count: number }[] = [];

  for (let i = WEEKS * 7 - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: activity.get(key) ?? 0 });
  }

  const maxCount = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-xl border border-border bg-surface p-3">
      <h2 className="mb-2 shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs">
        {activityHeatmapLabel}
      </h2>
      <div className="flex min-h-0 flex-1 items-center overflow-hidden">
        <div
          className="grid h-full max-h-full w-full gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
            gridTemplateRows: "repeat(7, minmax(0, 1fr))",
            gridAutoFlow: "column",
          }}
        >
          {days.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} order${day.count === 1 ? "" : "s"}`}
              className="min-h-0 min-w-0 rounded-[2px]"
              style={{
                backgroundColor:
                  day.count === 0
                    ? "var(--surface-muted)"
                    : `color-mix(in srgb, var(--sabr-green) ${Math.max(25, (day.count / maxCount) * 100)}%, transparent)`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex shrink-0 items-center justify-end gap-1.5 text-[10px] text-gray-500">
        <span>{activityHeatmapLess}</span>
        <div className="flex gap-0.5">
          {[0, 0.25, 0.5, 0.75, 1].map((level) => (
            <div
              key={level}
              className="h-2 w-2 rounded-[2px]"
              style={{
                backgroundColor:
                  level === 0
                    ? "var(--surface-muted)"
                    : `color-mix(in srgb, var(--sabr-green) ${level * 100}%, transparent)`,
              }}
            />
          ))}
        </div>
        <span>{activityHeatmapMore}</span>
      </div>
    </div>
  );
}
