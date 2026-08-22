create table if not exists public.wildfire_alerts (
  id text primary key,                 -- WFIGS: IrwinID/UniqueFireIdentifier. FIRMS: synthetic grid-cell+date key.
  source text not null check (source in ('wfigs', 'firms')),
  incident_name text,                  -- null for FIRMS-only hotspot detections (no official name yet)
  lat double precision not null,
  lng double precision not null,
  distance_miles numeric not null,
  discovered_at timestamptz,
  percent_contained numeric,
  acres numeric,
  status text not null default 'active' check (status in ('active', 'cleared')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  cleared_at timestamptz,
  raw jsonb,
  updated_at timestamptz not null default now()
);

alter table public.wildfire_alerts enable row level security;
-- No public select policy needed: only read via the service-role admin client
-- inside src/app/api/fire-alerts/route.ts, which sanitizes the response.

create index if not exists wildfire_alerts_status_idx
  on public.wildfire_alerts (status);

create table if not exists public.fire_check_runs (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  source text not null check (source in ('wfigs', 'firms')),
  success boolean not null,
  incidents_fetched int,
  incidents_in_range int,
  error text
);

alter table public.fire_check_runs enable row level security;
-- Internal diagnostics only; read via Supabase dashboard or service-role client.

create index if not exists fire_check_runs_ran_at_idx
  on public.fire_check_runs (ran_at desc);
