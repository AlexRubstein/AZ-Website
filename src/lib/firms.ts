import { routeDataSummary } from "@/lib/route-preview-data";

export type FirmsHotspot = {
  id: string;
  lat: number;
  lng: number;
  detectedAt: string;
  source: "firms";
};

const FETCH_TIMEOUT_MS = 10_000;
const BOUNDS_MARGIN_MILES = 30;
const MILES_PER_DEGREE_LAT = 69;
const CLUSTER_GRID_DEGREES = 0.03; // ~2 miles, matches the plan's "2-3 mile" clustering radius
const DAY_RANGE = 1;
const HIGH_CONFIDENCE = "h";

function buildAreaUrl(): string {
  const mapKey = process.env.FIRMS_MAP_KEY;
  if (!mapKey) {
    throw new Error("FIRMS_MAP_KEY is not configured");
  }

  const { minLat, maxLat, minLng, maxLng } = routeDataSummary.bounds;
  const latMargin = BOUNDS_MARGIN_MILES / MILES_PER_DEGREE_LAT;
  const midLat = (minLat + maxLat) / 2;
  const milesPerDegreeLng = MILES_PER_DEGREE_LAT * Math.cos((midLat * Math.PI) / 180);
  const lngMargin = BOUNDS_MARGIN_MILES / Math.max(milesPerDegreeLng, 1);

  const west = minLng - lngMargin;
  const south = minLat - latMargin;
  const east = maxLng + lngMargin;
  const north = maxLat + latMargin;

  return `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${mapKey}/VIIRS_SNPP_NRT/${west},${south},${east},${north}/${DAY_RANGE}`;
}

function parseCsv(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) {
    return [];
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim() ?? "";
    });
    return row;
  });
}

function gridKeyFor(lat: number, lng: number, acqDate: string): string {
  const latCell = Math.round(lat / CLUSTER_GRID_DEGREES);
  const lngCell = Math.round(lng / CLUSTER_GRID_DEGREES);
  return `firms:${latCell}:${lngCell}:${acqDate}`;
}

export async function fetchHighConfidenceHotspots(): Promise<FirmsHotspot[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(buildAreaUrl(), { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`FIRMS request failed with status ${response.status}`);
    }

    const csv = await response.text();
    const rows = parseCsv(csv);

    const clusters = new Map<
      string,
      { latSum: number; lngSum: number; count: number; latestDetectedAt: string }
    >();

    for (const row of rows) {
      if (row.confidence?.toLowerCase() !== HIGH_CONFIDENCE) {
        continue;
      }

      const lat = Number(row.latitude);
      const lng = Number(row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || !row.acq_date) {
        continue;
      }

      const key = gridKeyFor(lat, lng, row.acq_date);
      const detectedAt = `${row.acq_date}T${(row.acq_time || "0000").padStart(4, "0").replace(
        /(\d{2})(\d{2})/,
        "$1:$2"
      )}:00Z`;

      const existing = clusters.get(key);
      if (existing) {
        existing.latSum += lat;
        existing.lngSum += lng;
        existing.count += 1;
        if (detectedAt > existing.latestDetectedAt) {
          existing.latestDetectedAt = detectedAt;
        }
      } else {
        clusters.set(key, { latSum: lat, lngSum: lng, count: 1, latestDetectedAt: detectedAt });
      }
    }

    return Array.from(clusters.entries()).map(([id, cluster]) => ({
      id,
      lat: cluster.latSum / cluster.count,
      lng: cluster.lngSum / cluster.count,
      detectedAt: cluster.latestDetectedAt,
      source: "firms" as const,
    }));
  } finally {
    clearTimeout(timeout);
  }
}
