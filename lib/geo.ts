export interface LatLng {
  lat: number;
  lng: number;
}

export const FALLBACK_CONNAUGHT_PLACE: LatLng = {
  lat: 28.6129,
  lng: 77.2295,
};

export const FALLBACK_BANDRA_MUMBAI: LatLng = {
  lat: 19.0596,
  lng: 72.8295,
};

const PICKUP_OFFSET_MIN_DEG = 0.012;
const PICKUP_OFFSET_MAX_DEG = 0.025;

export function getRandomFallbackCenter(): LatLng {
  return Math.random() < 0.5
    ? FALLBACK_CONNAUGHT_PLACE
    : FALLBACK_BANDRA_MUMBAI;
}

/** Deterministic offset from delivery coords (stable across re-renders). */
export function generateStablePickupOffset(delivery: LatLng): LatLng {
  const seed =
    Math.abs(Math.sin(delivery.lat * 1000) * Math.cos(delivery.lng * 1000)) %
    1;
  const magnitude =
    PICKUP_OFFSET_MIN_DEG + seed * (PICKUP_OFFSET_MAX_DEG - PICKUP_OFFSET_MIN_DEG);
  const bearingRad =
    (Math.abs(Math.sin(delivery.lng * 500 + delivery.lat * 300)) % 1) *
    2 *
    Math.PI;
  const latRad = (delivery.lat * Math.PI) / 180;

  const deltaLat = magnitude * Math.cos(bearingRad);
  const deltaLng = (magnitude * Math.sin(bearingRad)) / Math.cos(latRad);

  return {
    lat: delivery.lat + deltaLat,
    lng: delivery.lng + deltaLng,
  };
}

/** Offset in degrees along a random bearing (roughly 1.5–3 km). */
export function generatePickupOffset(delivery: LatLng): LatLng {
  const magnitude =
    PICKUP_OFFSET_MIN_DEG +
    Math.random() * (PICKUP_OFFSET_MAX_DEG - PICKUP_OFFSET_MIN_DEG);
  const bearingRad = Math.random() * 2 * Math.PI;
  const latRad = (delivery.lat * Math.PI) / 180;

  const deltaLat = magnitude * Math.cos(bearingRad);
  const deltaLng = (magnitude * Math.sin(bearingRad)) / Math.cos(latRad);

  return {
    lat: delivery.lat + deltaLat,
    lng: delivery.lng + deltaLng,
  };
}

export function haversineMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(h));
}

export function bearingDegrees(from: LatLng, to: LatLng): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export function straightLineRoute(pickup: LatLng, delivery: LatLng): LatLng[] {
  return [pickup, delivery];
}
