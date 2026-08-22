insert into storage.buckets (id, name, public)
values ('protected-downloads', 'protected-downloads', false)
on conflict (id) do update set public = false;

create table if not exists public.download_files (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  file_type text not null,
  version text not null,
  storage_path text not null,
  filename text not null,
  content_type text not null default 'application/octet-stream',
  active boolean not null default true,
  published_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.download_files enable row level security;

drop policy if exists "Active download metadata is public" on public.download_files;
create policy "Active download metadata is public"
on public.download_files
for select
to anon, authenticated
using (active = true);

create table if not exists public.download_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  download_file_id uuid not null references public.download_files(id) on delete cascade,
  download_slug text not null,
  terms_version text not null,
  accepted_at timestamptz not null default now(),
  access_token text not null unique,
  token_expires_at timestamptz not null default (now() + interval '15 minutes')
);

alter table public.download_acceptances enable row level security;

create index if not exists download_acceptances_user_id_idx
  on public.download_acceptances (user_id);

create index if not exists download_acceptances_download_file_id_idx
  on public.download_acceptances (download_file_id);

create index if not exists download_acceptances_access_lookup_idx
  on public.download_acceptances (
    download_file_id,
    download_slug,
    user_id,
    access_token,
    token_expires_at
  );

drop policy if exists "Users can read their own download acceptances" on public.download_acceptances;
create policy "Users can read their own download acceptances"
on public.download_acceptances
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own download acceptances" on public.download_acceptances;

insert into public.download_files (
  slug,
  title,
  file_type,
  version,
  storage_path,
  filename,
  content_type,
  active,
  published_at
)
values
  (
    'arizona-alpine-trail-gpx',
    'Complete Trail GPX',
    'GPX',
    'V5 / Mar 21, 2026',
    'current/arizona-alpine-trail.gpx',
    'arizona-alpine-trail.gpx',
    'application/gpx+xml',
    true,
    '2026-03-21'
  ),
  (
    'azat-segments-v5-kml',
    'Segment Overlay KML',
    'KML',
    'V5 / Mar 21, 2026',
    'current/azat-segments-v5.kml',
    'azat-segments-v5.kml',
    'application/vnd.google-earth.kml+xml',
    true,
    '2026-03-21'
  ),
  (
    'azat-shapefile',
    'GIS Shapefile',
    'SHP',
    'Planning archive',
    'current/azat-shapefile.zip',
    'azat-shapefile.zip',
    'application/zip',
    true,
    null
  )
on conflict (slug) do update set
  title = excluded.title,
  file_type = excluded.file_type,
  version = excluded.version,
  storage_path = excluded.storage_path,
  filename = excluded.filename,
  content_type = excluded.content_type,
  active = excluded.active,
  published_at = excluded.published_at,
  updated_at = now();
