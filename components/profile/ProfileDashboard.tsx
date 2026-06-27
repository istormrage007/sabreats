"use client";

import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";
import { OrderHistoryList } from "@/components/profile/OrderHistoryList";
import { StatsCards } from "@/components/profile/StatsCards";
import { ActiveOrdersPanel } from "@/components/orders/ActiveOrdersPanel";
import {
  profilePageSubtitle,
  profilePageTitle,
} from "@/copy/profile_Copy";
import { useProfileDashboard } from "@/hooks/useProfileStats";

export function ProfileDashboard() {
  const { stats, orders } = useProfileDashboard();

  return (
    <div className="mx-auto flex h-[calc(100dvh-5.5rem)] max-h-[calc(100dvh-5.5rem)] min-h-0 w-full max-w-6xl flex-col gap-2 overflow-hidden px-4 py-3">
      <header className="shrink-0">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {profilePageTitle}
        </h1>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 sm:text-sm">
          {profilePageSubtitle}
        </p>
      </header>

      <ActiveOrdersPanel />

      <StatsCards stats={stats} orders={orders} />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 md:grid-cols-5">
        <div className="flex min-h-0 md:col-span-3">
          <ActivityHeatmap orders={orders} />
        </div>
        <div className="flex min-h-0 md:col-span-2">
          <OrderHistoryList orders={orders} />
        </div>
      </div>
    </div>
  );
}
