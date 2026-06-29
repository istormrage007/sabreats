"use client";

import {
  giveUpRateLabel,
  impulsesResistedLabel,
  mostTemptedCategoryLabel,
  mostTemptedVerticalLabel,
  noDataLabel,
  ordersPlacedLabel,
  totalSabrMinutesLabel,
} from "@/copy/profile_Copy";
import {
  verticalBadgeEats,
  verticalBadgeFlix,
  verticalBadgeHomes,
  verticalBadgeHype,
} from "@/copy/layout_Copy";
import {
  getMostTemptedCategory,
  getMostTemptedVertical,
} from "@/lib/profileStats";
import type { ProfileStats } from "@/lib/profileStats";
import type { StoredOrderSummary } from "@/lib/order";
import type { VerticalId } from "@/types/vertical";

const verticalLabels: Record<VerticalId, string> = {
  eats: verticalBadgeEats,
  hype: verticalBadgeHype,
  homes: verticalBadgeHomes,
  flix: verticalBadgeFlix,
};

interface StatsCardsProps {
  stats: ProfileStats;
  orders: StoredOrderSummary[];
}

export function StatsCards({ stats, orders }: StatsCardsProps) {
  const allPayloads = orders.flatMap((o) => o.payloads);
  const temptedVertical = getMostTemptedVertical(allPayloads);
  const temptedCategory = getMostTemptedCategory(allPayloads);
  const totalMinutes = orders.reduce(
    (sum, o) => sum + o.estimatedDeliveryMinutes,
    0,
  );
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const giveUpRate =
    orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0;

  const cards = [
    { label: impulsesResistedLabel, value: stats.impulsesResisted.toString() },
    { label: ordersPlacedLabel, value: orders.length.toString() },
    { label: totalSabrMinutesLabel, value: totalMinutes.toString() },
    { label: giveUpRateLabel, value: `${giveUpRate}%` },
    {
      label: mostTemptedVerticalLabel,
      value: temptedVertical ? verticalLabels[temptedVertical] : noDataLabel,
    },
    {
      label: mostTemptedCategoryLabel,
      value: temptedCategory ?? noDataLabel,
    },
  ];

  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-surface px-2.5 py-2.5 sm:px-3"
        >
          <p className="text-[10px] font-semibold uppercase leading-tight tracking-wide text-gray-500 sm:truncate sm:text-[10px]">
            {card.label}
          </p>
          <p className="mt-1 text-base font-bold tabular-nums leading-tight text-foreground sm:mt-0.5 sm:truncate sm:text-xl">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
