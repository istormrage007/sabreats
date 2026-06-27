import {
  EMPTY_PROFILE_STATS,
  getProfileStatsSnapshot,
  subscribeProfile,
  type ProfileStats,
} from "@/lib/profileStats";
import {
  getAllOrdersSnapshot,
  subscribeOrders,
  type StoredOrderSummary,
} from "@/lib/order";
import { useSyncExternalStore } from "react";

export interface ProfileDashboardSnapshot {
  stats: ProfileStats;
  orders: StoredOrderSummary[];
}

const EMPTY_DASHBOARD: ProfileDashboardSnapshot = {
  stats: EMPTY_PROFILE_STATS,
  orders: [],
};

let cachedDashboard: ProfileDashboardSnapshot = EMPTY_DASHBOARD;
let cachedStatsRef: ProfileStats | null = null;
let cachedOrdersRef: StoredOrderSummary[] | null = null;

export function getProfileDashboardSnapshot(): ProfileDashboardSnapshot {
  if (typeof window === "undefined") {
    return EMPTY_DASHBOARD;
  }

  const stats = getProfileStatsSnapshot();
  const orders = getAllOrdersSnapshot();

  if (stats === cachedStatsRef && orders === cachedOrdersRef) {
    return cachedDashboard;
  }

  cachedStatsRef = stats;
  cachedOrdersRef = orders;
  cachedDashboard = { stats, orders };
  return cachedDashboard;
}

function subscribeAll(onChange: () => void) {
  const unsubProfile = subscribeProfile(onChange);
  const unsubOrders = subscribeOrders(onChange);
  return () => {
    unsubProfile();
    unsubOrders();
  };
}

export function useProfileStats() {
  return useSyncExternalStore(
    subscribeProfile,
    getProfileStatsSnapshot,
    () => EMPTY_PROFILE_STATS,
  );
}

export function useAllOrders() {
  return useSyncExternalStore(
    subscribeOrders,
    getAllOrdersSnapshot,
    () => EMPTY_DASHBOARD.orders,
  );
}

export function useProfileDashboard() {
  return useSyncExternalStore(
    subscribeAll,
    getProfileDashboardSnapshot,
    () => EMPTY_DASHBOARD,
  );
}

export { PROFILE_CHANGED_EVENT } from "@/lib/profileStats";
