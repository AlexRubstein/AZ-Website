import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sourceGpxPath = resolve("protected-download-seed/current/arizona-alpine-trail.gpx");
const outputPath = resolve("src/lib/route-preview-data.ts");
const gpx = readFileSync(sourceGpxPath, "utf8");

const metersPerMile = 1609.344;
const earthRadiusMeters = 6371008.8;

function textFrom(xml, tag) {
  return xml.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() || "";
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function validElevationMeters(value) {
  return value != null && value > 0 ? value : null;
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceMeters(a, b) {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const deltaLat = toRadians(b.lat - a.lat);
  const deltaLng = toRadians(b.lng - a.lng);
  const sinLat = Math.sin(deltaLat / 2);
  const sinLng = Math.sin(deltaLng / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function parseTrackPoints(segmentXml) {
  return [...segmentXml.matchAll(/<trkpt lat="([^"]+)" lon="([^"]+)"([\s\S]*?)<\/trkpt>/g)].map((match) => ({
    lat: Number(match[1]),
    lng: Number(match[2]),
    ele: numberOrNull(textFrom(match[3], "ele")),
  }));
}

function parseWaypoint(match) {
  const body = match[3];
  const label = textFrom(body, "label_text");
  return {
    label: label || textFrom(body, "name"),
    name: textFrom(body, "name"),
    type: textFrom(body, "type") || "Waypoint",
    symbol: textFrom(body, "sym") || undefined,
    lat: Number(match[1]),
    lng: Number(match[2]),
    eleMeters: numberOrNull(textFrom(body, "ele")),
  };
}

function summarizeSegment(segment, index, startMile) {
  let distance = 0;
  let minElevationMeters = Number.POSITIVE_INFINITY;
  let maxElevationMeters = Number.NEGATIVE_INFINITY;

  segment.points.forEach((point, pointIndex) => {
    const elevation = validElevationMeters(point.ele);
    if (elevation != null) {
      minElevationMeters = Math.min(minElevationMeters, elevation);
      maxElevationMeters = Math.max(maxElevationMeters, elevation);
    }
    if (pointIndex > 0) distance += distanceMeters(segment.points[pointIndex - 1], point);
  });

  const miles = distance / metersPerMile;
  const start = segment.points[0];
  const end = segment.points.at(-1);

  return {
    id: segment.id,
    name: segment.name || `Route segment ${index + 1}`,
    pointCount: segment.points.length,
    distanceMiles: round(miles, 2),
    startMile: round(startMile, 2),
    endMile: round(startMile + miles, 2),
    start: start ? { lat: round(start.lat, 6), lng: round(start.lng, 6) } : null,
    end: end ? { lat: round(end.lat, 6), lng: round(end.lng, 6) } : null,
    minElevationFeet: Number.isFinite(minElevationMeters) ? Math.round(minElevationMeters * 3.28084) : null,
    maxElevationFeet: Number.isFinite(maxElevationMeters) ? Math.round(maxElevationMeters * 3.28084) : null,
  };
}

function sampleSegment(points, targetPoints) {
  if (points.length <= targetPoints) return points;
  const sampleEvery = Math.max(1, Math.floor(points.length / targetPoints));
  const sampled = points.filter((_, index) => index % sampleEvery === 0);
  const last = points.at(-1);
  if (last && sampled.at(-1) !== last) sampled.push(last);
  return sampled;
}

function createMileMarkers(segments, intervalMiles = 25) {
  const markers = [];
  let nextMarkerMeters = intervalMiles * metersPerMile;
  let cumulativeMeters = 0;

  for (const segment of segments) {
    for (let index = 1; index < segment.points.length; index += 1) {
      const previous = segment.points[index - 1];
      const current = segment.points[index];
      const legMeters = distanceMeters(previous, current);

      while (legMeters > 0 && cumulativeMeters + legMeters >= nextMarkerMeters) {
        const ratio = (nextMarkerMeters - cumulativeMeters) / legMeters;
        markers.push({
          mile: round(nextMarkerMeters / metersPerMile, 0),
          lat: round(previous.lat + (current.lat - previous.lat) * ratio, 6),
          lng: round(previous.lng + (current.lng - previous.lng) * ratio, 6),
        });
        nextMarkerMeters += intervalMiles * metersPerMile;
      }

      cumulativeMeters += legMeters;
    }
  }

  return markers;
}

const metadataBoundsMatch = gpx.match(/<bounds minlat="([^"]+)" minlon="([^"]+)" maxlat="([^"]+)" maxlon="([^"]+)"/);

const trackMatches = [...gpx.matchAll(/<trk>([\s\S]*?)<\/trk>/g)];
const routeSegmentsFull = trackMatches
  .map((trackMatch, index) => {
    const trackXml = trackMatch[1];
    const name = textFrom(trackXml, "name");
    const segmentXml = trackXml.match(/<trkseg>([\s\S]*?)<\/trkseg>/)?.[1] || "";
    return {
      id: name
        ? name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")
        : `segment-${index + 1}`,
      name,
      points: parseTrackPoints(segmentXml),
    };
  })
  .filter((segment) => segment.points.length > 1);

const fullPoints = routeSegmentsFull.flatMap((segment) => segment.points);

if (!fullPoints.length) {
  throw new Error("No GPX track points found.");
}

const bounds =
  metadataBoundsMatch
    ? {
        minLat: Number(metadataBoundsMatch[1]),
        maxLat: Number(metadataBoundsMatch[3]),
        minLng: Number(metadataBoundsMatch[2]),
        maxLng: Number(metadataBoundsMatch[4]),
      }
    : fullPoints.reduce(
        (acc, point) => ({
          minLat: Math.min(acc.minLat, point.lat),
          maxLat: Math.max(acc.maxLat, point.lat),
          minLng: Math.min(acc.minLng, point.lng),
          maxLng: Math.max(acc.maxLng, point.lng),
        }),
        {
          minLat: Number.POSITIVE_INFINITY,
          maxLat: Number.NEGATIVE_INFINITY,
          minLng: Number.POSITIVE_INFINITY,
          maxLng: Number.NEGATIVE_INFINITY,
        },
      );

let cumulativeMiles = 0;
const routeSegmentSummaries = routeSegmentsFull.map((segment, index) => {
  const summary = summarizeSegment(segment, index, cumulativeMiles);
  cumulativeMiles += summary.distanceMiles;
  return summary;
});

const totalMiles = routeSegmentSummaries.reduce((sum, segment) => sum + segment.distanceMiles, 0);
const allElevationValues = fullPoints.map((point) => validElevationMeters(point.ele)).filter((value) => value != null);
const routeWaypoints = [...gpx.matchAll(/<wpt lat="([^"]+)" lon="([^"]+)"([\s\S]*?)<\/wpt>/g)].map(parseWaypoint);
const routeMileMarkers = createMileMarkers(routeSegmentsFull);

const width = 720;
const height = 520;
const padding = 50;
const lngSpan = bounds.maxLng - bounds.minLng;
const latSpan = bounds.maxLat - bounds.minLat;

function project(point) {
  const rawX = ((point.lng - bounds.minLng) / lngSpan) * (width - padding * 2) + padding;
  const rawY = height - padding - ((point.lat - bounds.minLat) / latSpan) * (height - padding * 2);

  return {
    x: Number(Math.min(width - padding, Math.max(padding, rawX)).toFixed(1)),
    y: Number(Math.min(height - padding, Math.max(padding, rawY)).toFixed(1)),
  };
}

const targetPointsPerSegment = Math.max(12, Math.floor(500 / routeSegmentsFull.length));
const sampledSegmentsRaw = routeSegmentsFull.map((segment) => sampleSegment(segment.points, targetPointsPerSegment));
const sampledRaw = sampledSegmentsRaw.flat();
const sampled = sampledRaw.map(project);

const townCoordinates = [
  { label: "Alpine", type: "Trailhead", lat: 33.8481, lng: -109.1437 },
  { label: "Greer", type: "Lodging", lat: 34.0106, lng: -109.4584 },
  { label: "Show Low", type: "Fuel", lat: 34.2542, lng: -110.0298 },
  { label: "Pine", type: "Services", lat: 34.3845, lng: -111.4557 },
  { label: "Young", type: "Resupply", lat: 34.1017, lng: -110.9635 },
  { label: "Clifton", type: "Gateway", lat: 33.0509, lng: -109.2962 },
].map((pin) => ({ ...pin, ...project(pin) }));

const generatedAt = new Date().toISOString();
const routeDataSummary = {
  generatedAt,
  sourceGpxPath: "protected-download-seed/current/arizona-alpine-trail.gpx",
  sourceModifiedAt: textFrom(gpx, "time") || null,
  trackCount: routeSegmentsFull.length,
  trackPointCount: fullPoints.length,
  waypointCount: routeWaypoints.length,
  sampledPointCount: sampledRaw.length,
  totalDistanceMiles: round(totalMiles, 2),
  bounds,
  minElevationFeet: allElevationValues.length ? Math.round(Math.min(...allElevationValues) * 3.28084) : null,
  maxElevationFeet: allElevationValues.length ? Math.round(Math.max(...allElevationValues) * 3.28084) : null,
};

const content = `// This file is generated by scripts/generate-route-preview.mjs.
// Source of truth: protected-download-seed/current/arizona-alpine-trail.gpx

export type RoutePoint = { x: number; y: number };

export type RouteCoordinate = [number, number];

export type RouteSegment = RouteCoordinate[];

export type RoutePin = {
  label: string;
  type: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
};

export type RouteSegmentSummary = {
  id: string;
  name: string;
  pointCount: number;
  distanceMiles: number;
  startMile: number;
  endMile: number;
  start: { lat: number; lng: number } | null;
  end: { lat: number; lng: number } | null;
  minElevationFeet: number | null;
  maxElevationFeet: number | null;
};

export type RouteWaypoint = {
  label: string;
  name: string;
  type: string;
  symbol?: string;
  lat: number;
  lng: number;
  eleMeters: number | null;
};

export type RouteMileMarker = {
  mile: number;
  lat: number;
  lng: number;
};

export const routeDataSummary = ${JSON.stringify(routeDataSummary, null, 2)} as const;

export const routeSegmentSummaries: RouteSegmentSummary[] = ${JSON.stringify(routeSegmentSummaries, null, 2)};

export const routeWaypoints: RouteWaypoint[] = ${JSON.stringify(routeWaypoints, null, 2)};

export const routeMileMarkers: RouteMileMarker[] = ${JSON.stringify(routeMileMarkers, null, 2)};

export const routePreviewBounds = ${JSON.stringify(bounds, null, 2)} as const;

export const routePreviewPoints: RoutePoint[] = ${JSON.stringify(sampled)};

export const routePreviewCoordinates: RouteCoordinate[] = ${JSON.stringify(sampledRaw.map((point) => [round(point.lat, 6), round(point.lng, 6)]))};

export const routePreviewSegments: RouteSegment[] = ${JSON.stringify(sampledSegmentsRaw.map((segment) => segment.map((point) => [round(point.lat, 6), round(point.lng, 6)])))};

export const routePreviewPins: RoutePin[] = ${JSON.stringify(townCoordinates, null, 2)};
`;

writeFileSync(outputPath, content);

console.log(
  [
    `Wrote ${sampled.length} sampled route points to ${outputPath}`,
    `Tracks: ${routeDataSummary.trackCount}`,
    `Full track points: ${routeDataSummary.trackPointCount}`,
    `Waypoints: ${routeDataSummary.waypointCount}`,
    `Total measured miles: ${routeDataSummary.totalDistanceMiles}`,
  ].join("\n"),
);
