import type { LatLng } from "@/lib/geo";

const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";
const REVERSE_GEOCODE_TIMEOUT_MS = 8000;
const ADDRESS_PART_KEYS = [
  "neighbourhood",
  "suburb",
  "road",
  "quarter",
  "city_district",
  "city",
  "town",
  "village",
  "county",
  "state",
] as const;

interface NominatimReverseResponse {
  address?: Record<string, string>;
  display_name?: string;
}

export function formatAddressPillParts(
  address: Record<string, string>,
  maxParts = 2,
): string {
  const parts: string[] = [];

  for (const key of ADDRESS_PART_KEYS) {
    const value = address[key];
    if (value && !parts.includes(value)) {
      parts.push(value);
    }
    if (parts.length >= maxParts) break;
  }

  return parts.join(", ");
}

export async function reverseGeocodeLabel(
  position: LatLng,
): Promise<string | null> {
  const url =
    `${NOMINATIM_REVERSE_URL}?format=json` +
    `&lat=${position.lat}&lon=${position.lng}` +
    `&zoom=14&addressdetails=1`;

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    REVERSE_GEOCODE_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as NominatimReverseResponse;
    if (data.address) {
      const formatted = formatAddressPillParts(data.address);
      if (formatted) return formatted;
    }

    if (data.display_name) {
      return data.display_name.split(",").slice(0, 2).join(",").trim();
    }

    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
