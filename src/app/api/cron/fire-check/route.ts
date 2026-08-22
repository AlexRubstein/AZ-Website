import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { fetchActiveWildfireIncidents } from "@/lib/nifc";
import { fetchHighConfidenceHotspots } from "@/lib/firms";
import { distanceToTrailMiles, haversineMiles, isNearBoundingBox } from "@/lib/geo";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const RADIUS_MILES = Number(process.env.FIRE_ALERT_RADIUS_MILES) || 15;
const FIRMS_SUPPRESSION_MILES = 3;

type Source = "wfigs" | "firms";

type AlertRow = {
  id: string;
  source: Source;
  incident_name: string | null;
  lat: number;
  lng: number;
  distance_miles: number;
  discovered_at: string | null;
  percent_contained: number | null;
  acres: number | null;
  status: "active";
  last_seen_at: string;
  raw: unknown;
};

async function clearStaleAndUpsert(
  supabase: SupabaseClient,
  source: Source,
  rows: AlertRow[]
) {
  const { data: existingActive } = await supabase
    .from("wildfire_alerts")
    .select("id")
    .eq("source", source)
    .eq("status", "active");

  const existingIds = new Set((existingActive ?? []).map((row) => row.id as string));
  const currentIds = new Set(rows.map((row) => row.id));
  const staleIds = [...existingIds].filter((id) => !currentIds.has(id));

  if (staleIds.length > 0) {
    await supabase
      .from("wildfire_alerts")
      .update({ status: "cleared", cleared_at: new Date().toISOString() })
      .eq("source", source)
      .in("id", staleIds);
  }

  if (rows.length > 0) {
    await supabase.from("wildfire_alerts").upsert(rows, { onConflict: "id" });
  }
}

async function logRun(
  supabase: SupabaseClient,
  source: Source,
  outcome: { success: boolean; fetched?: number; inRange?: number; error?: string }
) {
  await supabase.from("fire_check_runs").insert({
    source,
    success: outcome.success,
    incidents_fetched: outcome.fetched ?? null,
    incidents_in_range: outcome.inRange ?? null,
    error: outcome.error ?? null,
  });
}

async function processWfigs(supabase: SupabaseClient) {
  try {
    const incidents = await fetchActiveWildfireIncidents();
    const inRange = incidents.filter(
      (incident) =>
        isNearBoundingBox({ lat: incident.lat, lng: incident.lng }, RADIUS_MILES) &&
        distanceToTrailMiles({ lat: incident.lat, lng: incident.lng }) <= RADIUS_MILES
    );

    const rows: AlertRow[] = inRange.map((incident) => ({
      id: incident.id,
      source: "wfigs",
      incident_name: incident.name,
      lat: incident.lat,
      lng: incident.lng,
      distance_miles: distanceToTrailMiles({ lat: incident.lat, lng: incident.lng }),
      discovered_at: incident.discoveredAt,
      percent_contained: incident.percentContained,
      acres: incident.acres,
      status: "active",
      last_seen_at: new Date().toISOString(),
      raw: incident,
    }));

    await clearStaleAndUpsert(supabase, "wfigs", rows);
    await logRun(supabase, "wfigs", { success: true, fetched: incidents.length, inRange: rows.length });
  } catch (error) {
    await logRun(supabase, "wfigs", {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function processFirms(supabase: SupabaseClient) {
  try {
    const hotspots = await fetchHighConfidenceHotspots();
    const inRange = hotspots.filter(
      (hotspot) =>
        isNearBoundingBox({ lat: hotspot.lat, lng: hotspot.lng }, RADIUS_MILES) &&
        distanceToTrailMiles({ lat: hotspot.lat, lng: hotspot.lng }) <= RADIUS_MILES
    );

    // Suppress FIRMS detections that are already covered by an active, more detailed WFIGS incident.
    const { data: activeWfigs } = await supabase
      .from("wildfire_alerts")
      .select("lat, lng")
      .eq("source", "wfigs")
      .eq("status", "active");

    const notCoveredByWfigs = inRange.filter((hotspot) =>
      (activeWfigs ?? []).every(
        (incident) =>
          haversineMiles(hotspot, { lat: incident.lat as number, lng: incident.lng as number }) >
          FIRMS_SUPPRESSION_MILES
      )
    );

    const rows: AlertRow[] = notCoveredByWfigs.map((hotspot) => ({
      id: hotspot.id,
      source: "firms",
      incident_name: null,
      lat: hotspot.lat,
      lng: hotspot.lng,
      distance_miles: distanceToTrailMiles({ lat: hotspot.lat, lng: hotspot.lng }),
      discovered_at: hotspot.detectedAt,
      percent_contained: null,
      acres: null,
      status: "active",
      last_seen_at: new Date().toISOString(),
      raw: hotspot,
    }));

    await clearStaleAndUpsert(supabase, "firms", rows);
    await logRun(supabase, "firms", { success: true, fetched: hotspots.length, inRange: rows.length });
  } catch (error) {
    await logRun(supabase, "firms", {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 500 });
  }

  // Sequential: FIRMS suppression reads WFIGS's just-updated active rows, so WFIGS must land first.
  await processWfigs(supabase);
  await processFirms(supabase);

  return NextResponse.json({ ok: true });
}
