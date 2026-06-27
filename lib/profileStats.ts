import type { VerticalId } from "@/types/vertical";

export const PROFILE_STORAGE_KEY = "sabr-profile";
export const PROFILE_CHANGED_EVENT = "sabr-profile-changed";

export interface ProfileStats {
  impulsesResisted: number;
  checkoutAbandons: number;
  cartClosesWithItems: number;
}

const DEFAULT_STATS: ProfileStats = {
  impulsesResisted: 0,
  checkoutAbandons: 0,
  cartClosesWithItems: 0,
};

export { DEFAULT_STATS as EMPTY_PROFILE_STATS };

let cachedProfileRaw: string | null | undefined;
let cachedProfile: ProfileStats | undefined;

function invalidateProfileCache() {
  cachedProfileRaw = undefined;
  cachedProfile = undefined;
}

function emitProfileChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(PROFILE_CHANGED_EVENT));
  }
}

function parseProfile(raw: string | null): ProfileStats {
  if (!raw) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(raw) as Partial<ProfileStats>;
    return {
      impulsesResisted: parsed.impulsesResisted ?? 0,
      checkoutAbandons: parsed.checkoutAbandons ?? 0,
      cartClosesWithItems: parsed.cartClosesWithItems ?? 0,
    };
  } catch {
    return DEFAULT_STATS;
  }
}

function persistProfile(stats: ProfileStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(stats));
  invalidateProfileCache();
  emitProfileChanged();
}

function increment(field: keyof ProfileStats) {
  if (typeof window === "undefined") return;
  const current = getProfileStatsSnapshot();
  const stats = { ...current };
  stats[field] += 1;
  stats.impulsesResisted += 1;
  persistProfile(stats);
}

export function subscribeProfile(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(PROFILE_CHANGED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(PROFILE_CHANGED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function getProfileStatsSnapshot(): ProfileStats {
  if (typeof window === "undefined") return DEFAULT_STATS;

  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (raw === cachedProfileRaw) {
    return cachedProfile ?? DEFAULT_STATS;
  }

  cachedProfileRaw = raw;
  cachedProfile = parseProfile(raw);
  return cachedProfile;
}

export function recordCartClosedWithItems(itemCount: number) {
  if (itemCount >= 2) {
    increment("cartClosesWithItems");
  }
}

export function recordCartEmptied() {
  increment("cartClosesWithItems");
}

export function recordCheckoutAbandoned() {
  increment("checkoutAbandons");
}

export function getMostTemptedVertical(
  payloads: { vertical?: VerticalId }[],
): VerticalId | null {
  const counts = new Map<VerticalId, number>();
  for (const payload of payloads) {
    if (!payload.vertical) continue;
    counts.set(payload.vertical, (counts.get(payload.vertical) ?? 0) + 1);
  }
  let best: VerticalId | null = null;
  let bestCount = 0;
  for (const [vertical, count] of counts) {
    if (count > bestCount) {
      best = vertical;
      bestCount = count;
    }
  }
  return best;
}

export function getMostTemptedCategory(
  payloads: { menuCategory?: string }[],
): string | null {
  const counts = new Map<string, number>();
  for (const payload of payloads) {
    if (!payload.menuCategory) continue;
    counts.set(
      payload.menuCategory,
      (counts.get(payload.menuCategory) ?? 0) + 1,
    );
  }
  let best: string | null = null;
  let bestCount = 0;
  for (const [category, count] of counts) {
    if (count > bestCount) {
      best = category;
      bestCount = count;
    }
  }
  return best;
}

export function buildActivityByDay(
  orders: { orderPlacedAt: number }[],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const order of orders) {
    const day = new Date(order.orderPlacedAt).toISOString().slice(0, 10);
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return map;
}
