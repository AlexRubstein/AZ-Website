import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/supabase/admin";

export const dynamic = "force-dynamic";

type FireAlertsResponse = {
  active: boolean;
  incidents: {
    id: string;
    name: string | null;
    distanceMiles: number;
    discoveredAt: string | null;
  }[];
  updatedAt: string | null;
};

const EMPTY_RESPONSE: FireAlertsResponse = { active: false, incidents: [], updatedAt: null };

export async function GET() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return jsonWithCache(EMPTY_RESPONSE);
  }

  const { data, error } = await supabase
    .from("wildfire_alerts")
    .select("id, incident_name, distance_miles, discovered_at, updated_at")
    .eq("status", "active")
    .order("distance_miles", { ascending: true });

  if (error || !data) {
    return jsonWithCache(EMPTY_RESPONSE);
  }

  const response: FireAlertsResponse = {
    active: data.length > 0,
    incidents: data.map((row) => ({
      id: row.id as string,
      name: row.incident_name as string | null,
      distanceMiles: Math.round((row.distance_miles as number) * 10) / 10,
      discoveredAt: row.discovered_at as string | null,
    })),
    updatedAt: data[0]?.updated_at ?? null,
  };

  return jsonWithCache(response);
}

function jsonWithCache(body: FireAlertsResponse) {
  return NextResponse.json(body, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
  });
}
