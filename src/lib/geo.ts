import { routeDataSummary, routePreviewCoordinates } from "@/lib/route-preview-data";

export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_MILES = 3958.8;
const MILES_PER_DEGREE_LAT = 69;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function haversineMiles(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_MILES * Math.asin(Math.sqrt(h));
}

export function isNearBoundingBox(point: LatLng, marginMiles: number): boolean {
  const { minLat, maxLat, minLng, maxLng } = routeDataSummary.bounds;
  const latMargin = marginMiles / MILES_PER_DEGREE_LAT;
  const midLat = (minLat + maxLat) / 2;
  const milesPerDegreeLng = MILES_PER_DEGREE_LAT * Math.cos(toRadians(midLat));
  const lngMargin = marginMiles / Math.max(milesPerDegreeLng, 1);

  return (
    point.lat >= minLat - latMargin &&
    point.lat <= maxLat + latMargin &&
    point.lng >= minLng - lngMargin &&
    point.lng <= maxLng + lngMargin
  );
}

export function distanceToTrailMiles(point: LatLng): number {
  let minDistance = Infinity;

  for (const [lat, lng] of routePreviewCoordinates) {
    const distance = haversineMiles(point, { lat, lng });
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
}
