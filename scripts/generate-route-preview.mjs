import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const gpxPath = resolve("public/azat/downloads/arizona-alpine-trail.gpx");
const outputPath = resolve("src/lib/route-preview-data.ts");
const gpx = readFileSync(gpxPath, "utf8");

const segments = [...gpx.matchAll(/<trkseg>([\s\S]*?)<\/trkseg>/g)]
  .map((segmentMatch) =>
    [...segmentMatch[1].matchAll(/<trkpt lat="([^"]+)" lon="([^"]+)"/g)].map((match) => ({
      lat: Number(match[1]),
      lng: Number(match[2]),
    })),
  )
  .filter((segment) => segment.length > 1);

const points = segments.flat();

if (!points.length) {
  throw new Error("No GPX track points found.");
}

const bounds = points.reduce(
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

const targetPointsPerSegment = Math.max(12, Math.floor(420 / segments.length));
const sampledSegmentsRaw = segments.map((segment) => {
  const sampleEvery = Math.max(1, Math.floor(segment.length / targetPointsPerSegment));
  const sampledSegment = segment.filter((_, index) => index % sampleEvery === 0);
  const last = segment.at(-1);
  if (last && sampledSegment.at(-1) !== last) sampledSegment.push(last);
  return sampledSegment;
});
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

const content = `export type RoutePoint = { x: number; y: number };

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

export const routePreviewBounds = ${JSON.stringify(bounds, null, 2)} as const;

export const routePreviewPoints: RoutePoint[] = ${JSON.stringify(sampled)};

export const routePreviewCoordinates: RouteCoordinate[] = ${JSON.stringify(sampledRaw.map((point) => [Number(point.lat.toFixed(6)), Number(point.lng.toFixed(6))]))};

export const routePreviewSegments: RouteSegment[] = ${JSON.stringify(sampledSegmentsRaw.map((segment) => segment.map((point) => [Number(point.lat.toFixed(6)), Number(point.lng.toFixed(6))])))};

export const routePreviewPins: RoutePin[] = ${JSON.stringify(townCoordinates, null, 2)};
`;

writeFileSync(outputPath, content);
console.log(`Wrote ${sampled.length} route points to ${outputPath}`);
