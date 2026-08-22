import { routeDataSummary } from "@/lib/route-preview-data";

export type WfigsIncident = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  discoveredAt: string | null;
  percentContained: number | null;
  acres: number | null;
  source: "wfigs";
};

const DEFAULT_ENDPOINT =
  "https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Incident_Locations/FeatureServer/0/query";
const FETCH_TIMEOUT_MS = 10_000;
const BOUNDS_MARGIN_MILES = 30; // padding beyond the alert radius so the bbox pre-filter never clips a real match
const MILES_PER_DEGREE_LAT = 69;
// WFIGS_Incident_Locations is a full historical archive back to 2014, not just current fires —
// FireOutDateTime is frequently left null on old/small closed incidents, so it alone doesn't mean
// "still burning." Bounding by recent discovery + not-fully-contained approximates "active" without
// a dedicated current-incidents feed.
const ACTIVE_LOOKBACK_DAYS = 180;

function toArcgisTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

type ArcgisFeature = {
  attributes: Record<string, string | number | null>;
  geometry?: { x: number; y: number };
};

type ArcgisQueryResponse = {
  features?: ArcgisFeature[];
  error?: { code: number; message: string };
};

function buildQueryUrl(): string {
  const endpoint = process.env.NIFC_WFIGS_ENDPOINT || DEFAULT_ENDPOINT;
  const { minLat, maxLat, minLng, maxLng } = routeDataSummary.bounds;
  const latMargin = BOUNDS_MARGIN_MILES / MILES_PER_DEGREE_LAT;
  const midLat = (minLat + maxLat) / 2;
  const milesPerDegreeLng = MILES_PER_DEGREE_LAT * Math.cos((midLat * Math.PI) / 180);
  const lngMargin = BOUNDS_MARGIN_MILES / Math.max(milesPerDegreeLng, 1);

  const envelope = {
    xmin: minLng - lngMargin,
    ymin: minLat - latMargin,
    xmax: maxLng + lngMargin,
    ymax: maxLat + latMargin,
    spatialReference: { wkid: 4326 },
  };

  const lookbackCutoff = new Date(Date.now() - ACTIVE_LOOKBACK_DAYS * 24 * 60 * 60 * 1000);
  const where =
    "IncidentTypeCategory='WF'" +
    " AND FireOutDateTime IS NULL" +
    " AND (PercentContained IS NULL OR PercentContained < 100)" +
    ` AND FireDiscoveryDateTime >= TIMESTAMP '${toArcgisTimestamp(lookbackCutoff)}'`;

  const params = new URLSearchParams({
    where,
    outFields: "IrwinID,UniqueFireIdentifier,IncidentName,FireDiscoveryDateTime,PercentContained,IncidentSize",
    geometry: JSON.stringify(envelope),
    geometryType: "esriGeometryEnvelope",
    inSR: "4326",
    outSR: "4326",
    spatialRel: "esriSpatialRelIntersects",
    returnGeometry: "true",
    f: "json",
  });

  return `${endpoint}?${params.toString()}`;
}

export async function fetchActiveWildfireIncidents(): Promise<WfigsIncident[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(buildQueryUrl(), { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`WFIGS request failed with status ${response.status}`);
    }

    const data = (await response.json()) as ArcgisQueryResponse;

    if (data.error) {
      throw new Error(`WFIGS query error ${data.error.code}: ${data.error.message}`);
    }

    return (data.features ?? [])
      .filter((feature) => feature.geometry)
      .map((feature): WfigsIncident | null => {
        const attrs = feature.attributes;
        const id = (attrs.IrwinID || attrs.UniqueFireIdentifier) as string | null;
        const name = attrs.IncidentName as string | null;

        if (!id || !name || !feature.geometry) {
          return null;
        }

        return {
          id,
          name,
          lat: feature.geometry.y,
          lng: feature.geometry.x,
          discoveredAt: (attrs.FireDiscoveryDateTime as number | null)
            ? new Date(attrs.FireDiscoveryDateTime as number).toISOString()
            : null,
          percentContained: (attrs.PercentContained as number | null) ?? null,
          acres: (attrs.IncidentSize as number | null) ?? null,
          source: "wfigs",
        };
      })
      .filter((incident): incident is WfigsIncident => incident !== null);
  } finally {
    clearTimeout(timeout);
  }
}
