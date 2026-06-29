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
    <div className="mx-auto w-full max-w-6xl px-3 py-4 pb-8 sm:px-4 sm:py-3 md:flex md:h-[calc(100dvh-4.5rem)] md:max-h-[calc(100dvh-4.5rem)] md:min-h-0 md:flex-col md:gap-2 md:overflow-hidden md:pb-3">
      <header className="shrink-0">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          {profilePageTitle}
        </h1>
        <p className="mt-0.5 text-xs text-gray-500 sm:line-clamp-1 sm:text-sm">
          {profilePageSubtitle}
        </p>
      </header>

      <ActiveOrdersPanel />

      <StatsCards stats={stats} orders={orders} />

      <div className="grid grid-cols-1 gap-3 md:min-h-0 md:flex-1 md:grid-cols-5 md:gap-2">
        <div className="flex min-h-[7.5rem] md:col-span-3 md:min-h-0">
          <ActivityHeatmap orders={orders} />
        </div>
        <div className="flex min-h-[12rem] md:col-span-2 md:min-h-0">
          <OrderHistoryList orders={orders} />
        </div>
      </div>
    </div>
  );
}
