import { OSRM_BASE_URL, OSRM_REQUEST_TIMEOUT_MS } from "@/lib/constants";
import { type LatLng, straightLineRoute } from "@/lib/geo";

export type { LatLng };

interface OsrmRouteResponse {
  routes?: {
    geometry?: {
      coordinates?: [number, number][];
    };
  }[];
}

/** OSRM returns [lng, lat]; convert to Leaflet { lat, lng }. */
function geoJsonToLatLngs(coordinates: [number, number][]): LatLng[] {
  return coordinates.map(([lng, lat]) => ({ lat, lng }));
}

export async function fetchOsrmRoute(
  pickup: LatLng,
  delivery: LatLng,
): Promise<LatLng[]> {
  const url =
    `${OSRM_BASE_URL}/route/v1/driving/` +
    `${pickup.lng},${pickup.lat};${delivery.lng},${delivery.lat}` +
    `?overview=full&geometries=geojson`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OSRM_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      return straightLineRoute(pickup, delivery);
    }

    const data = (await response.json()) as OsrmRouteResponse;
    const coordinates = data.routes?.[0]?.geometry?.coordinates;

    if (!coordinates || coordinates.length < 2) {
      return straightLineRoute(pickup, delivery);
    }

    return geoJsonToLatLngs(coordinates);
  } catch {
    return straightLineRoute(pickup, delivery);
  } finally {
    clearTimeout(timeout);
  }
}
