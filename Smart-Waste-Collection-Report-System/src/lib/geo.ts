import type { GeoPoint, Zone } from "./types";

/** Default map centre: Colombo, Sri Lanka. */
export const DEFAULT_CENTER: GeoPoint = { lat: 6.9271, lng: 79.8612 };

const EARTH_RADIUS_M = 6_371_000;

/** Great-circle distance between two points in metres. */
export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Finds the collection zone a point belongs to. If several zones contain the
 * point, the one whose centre is closest wins. Returns null when no zone covers it.
 */
export function findZoneForPoint(point: GeoPoint, zones: Zone[]): Zone | null {
  let best: Zone | null = null;
  let bestDistance = Infinity;
  for (const zone of zones) {
    const distance = haversineMeters(point, zone.center);
    if (distance <= zone.radiusM && distance < bestDistance) {
      best = zone;
      bestDistance = distance;
    }
  }
  return best;
}
