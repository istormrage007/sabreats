import { getRandomFallbackCenter, type LatLng } from "@/lib/geo";
import { reverseGeocodeLabel } from "@/lib/reverseGeocode";

const ADDRESS_PILL_CACHE_KEY = "sabr-address-pill";

interface CachedAddressPill {
  key: string;
  label: string;
}

let resolvePromise: Promise<string> | null = null;

function coordsKey(position: LatLng): string {
  return `${position.lat.toFixed(4)},${position.lng.toFixed(4)}`;
}

function readCache(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADDRESS_PILL_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedAddressPill;
    return cached.key === key ? cached.label : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, label: string) {
  try {
    sessionStorage.setItem(
      ADDRESS_PILL_CACHE_KEY,
      JSON.stringify({ key, label }),
    );
  } catch {
    // ignore storage failures
  }
}

function getCurrentPosition(): Promise<LatLng> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getRandomFallbackCenter());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => resolve(getRandomFallbackCenter()),
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
}

async function resolveAddressPillLabel(fallbackLabel: string): Promise<string> {
  const position = await getCurrentPosition();
  const key = coordsKey(position);
  const cached = readCache(key);
  if (cached) return cached;

  const label = (await reverseGeocodeLabel(position)) ?? fallbackLabel;
  writeCache(key, label);
  return label;
}

export function fetchAddressPillLabel(fallbackLabel: string): Promise<string> {
  if (!resolvePromise) {
    resolvePromise = resolveAddressPillLabel(fallbackLabel).finally(() => {
      resolvePromise = null;
    });
  }
  return resolvePromise;
}
