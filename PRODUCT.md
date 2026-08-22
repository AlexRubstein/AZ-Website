# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: off-highway riders (UTV/ATV/motorcycle/truck) planning a real trip on the Arizona Alpine
Trail — a ~704-mile OHV loop through Eastern Arizona's high country. They arrive wanting to answer
concrete planning questions (where to start, which segment, how far, what to download) and often
check the site from a trailhead or town with weak signal, so mobile performance and low-friction
flows matter as much as desktop.

Secondary: the AZAT board/staff (nonprofit operators) who need the site to look credible to
municipal/agency partners and who will edit content themselves through Sanity Studio.

## Product Purpose

Arizona Alpine Trail (AZAT), a 501(c)(3) nonprofit, is moving off a WordPress brochure site onto a
custom Next.js platform. The product's job is to be the trusted digital planning companion for
riding the trail: find a segment, understand it (mileage, difficulty, elevation, terrain, hazards,
amenities), see it on a real map, and download the route file — end to end, with nothing generic or
templated getting in the way. Long-term it's meant to grow into a full trip-planning platform
(itinerary generation, fuel/lodging layers, TrailWatch-style condition reporting), but the current
phase is about making the trail/segment/download experience real and excellent.

## Positioning

Every competing OHV trail resource in this space (Arizona Peace Trail, Arizona Trail Association,
and AZAT's own current WordPress site) presents routes as either a bare download link or a raw
embedded Google My Maps widget with third-party UI chrome. AZAT's differentiator is real,
verified, first-party route data (actual GPX track data already in-repo, not a link to someone
else's map tool) presented with real trail knowledge — official difficulty ratings, elevation
figures, terrain descriptions, safety notes, amenities, and points of interest that AZAT itself has
authored — rendered natively in the site's own branded map, not borrowed UI from Google.

## Operating Context

- Riders plan before a trip (any device) and may reference pages at a trailhead or in town with weak
  connectivity — mobile is a first-class target, not an afterthought.
- Downloads require sign-in (Supabase auth), Terms acceptance, and a signed/streamed file — riders
  go through this each time they get a new route file.
- AZAT staff edit content through Sanity Studio at `/studio`. Non-technical editors need the CMS
  fields to map cleanly onto the real content they already produce (see Evidence on Hand).
- The full 704-mile loop is organized into 28 named, numbered trail segments (not an A/B route
  split) — segments are the atomic planning/download unit today.

## Capabilities and Constraints

- Stack: Next.js (App Router) + TypeScript + Tailwind, Sanity CMS, Supabase auth/storage, deployed
  on Vercel.
- Protected downloads (auth + terms + signed stream) are already built and working —
  `ProtectedDownloadLink` + `/api/downloads/[slug]`. Reuse as-is; do not rebuild.
- Real route geometry already exists in-repo: `protected-download-seed/current/arizona-alpine-trail.gpx`
  contains all 28 named segment tracks. `scripts/generate-route-preview.mjs` parses it into
  `src/lib/route-preview-data.ts` (per-segment distance, elevation min/max, start/end coordinates,
  simplified lat/lng polylines). This is the source of truth for map geometry and trail stats — not
  third-party embeds.
- Existing map components: `LeafletRouteMap` (2D, whole-route today) and `TrailTerrainMap` (3D Mapbox
  terrain flythrough at `/trail/3d`) — both already consume `route-preview-data.ts` and should be
  extended, not replaced.
- Undecided/open: whether AZAT has pre-made fact-sheet content (like the Rye Creek one) for other
  segments beyond Rye Creek — affects how much of the 28-segment rollout is a content-entry task vs.
  a data-gathering task.

## Brand Commitments

Documented in `docs/ui-direction.md` and `docs/azat-design-brief.md` — treat both as binding.

- Voice: "a field guide for riders, a scenic trail journal, a practical planning tool, a community
  and stewardship project." Rugged, practical, scenic, trustworthy. Never generic SaaS/startup.
- Color tokens (from `src/app/globals.css`): `forest-deep` `#08130d`, `forest` `#173d2b`, `pine`
  `#235840`, `clay` `#b74f32` (primary CTA/accent), `ochre` `#b87939`, `sun` `#f1b65a`, `paper`
  `#fffdf7`, `cream` `#f8f4e8`, `stone` `#d8ded4` (borders), `muted` `#5f6c63`, `sky` `#6ca7c7`
  (sparing).
- Typography: condensed/serif display for hero and section titles (uppercase, zero or positive
  letter-spacing, never negative), Geist Sans for body/UI, Geist Mono uppercase for kickers/metadata.
- Imagery: real AZAT photography only (`public/azat/photos`, `/images`, `/ride`, brand mark) — no
  stock, no abstract gradients/blobs.
- Small card radii (4–8px), no nested/floating decorative cards, no motion without
  `prefers-reduced-motion` fallback, comfortable touch targets (40–44px+).
- Real client-authored fact-sheet format exists for at least the Rye Creek segment (see Evidence on
  Hand) — a dark header bar with length/elevation/rating/gain/loss, an amenities icon row, two
  description paragraphs, a safety note, and points of interest. This is real AZAT content
  structure, not a design invention, and should shape the segment page's information architecture
  (translated into the site's own token palette, not copied literally).

## Evidence on Hand

- Full-trail GPX with all 28 named segment tracks: `protected-download-seed/current/arizona-alpine-trail.gpx`.
- Generated per-segment stats/geometry: `src/lib/route-preview-data.ts` (distance, elevation,
  start/end coords, simplified polyline per segment).
- Real Rye Creek (segment 01) fact sheet, provided by the client in chat: length 25.4 mi, min/max
  elevation 2,761/5,007 ft MSL (matches GPX-derived figures), trail rating "More Difficult/Blue,"
  gain 3,357 ft, loss 5,239 ft, full route description (FR 406/FR 511 to FR 184/SR 188, Tonto
  National Forest, named landmarks, terrain/vehicle recommendation), amenities
  (Food/Fuel/Lodging/Medical/Potable Water/Restroom/Parking/Repair legend with real
  Payson/Jakes Corner/Gisela specifics), a safety note (heat, flash flooding, livestock, SR 87
  crossing), and points of interest (Gisela Ruins, Jim Jones Shooting Range, Hellsgate Wilderness
  Area, Tonto Creek, Jake's Corner Ruins, Roosevelt Lake, Mazatzal Peak views). Real Rye Creek
  photography is coming from the client separately (not yet delivered).
- Existing flagship page (quality bar to match): `src/app/rustys-route-1000/page.tsx` +
  `RustysRouteExperience` — hero, facts strip, map, planning notes, day cards, download CTA,
  Sanity-driven with fallback data.
- `~25` untagged general trail photos exist today in `public/azat/{photos,images,ride}` — thin, but a
  larger off-site photo library exists and the client will supply additional photos (segment-tagged
  where possible).
- State absence: no confirmed fact sheets or photography yet for the other 27 segments — do not
  invent status, difficulty, or descriptive content for segments beyond what's confirmed.

## Product Principles

1. Real data over borrowed UI — render AZAT's own GPX-derived geometry and authored facts natively;
   never re-embed a third-party map widget.
2. Ship only what's real — a segment gets a full page when its route and facts are confirmed; unbuilt
   segments get an honest "in development" state, never an empty placeholder page.
3. Mobile and poor-signal use are primary, not secondary — every planning/download flow must hold up
   on a phone at a trailhead.
4. Content structure follows AZAT's own authored format (the fact-sheet fields) rather than
   inventing a new one — the CMS schema should mirror what AZAT already produces.
5. Existing working systems (protected downloads, Sanity content model, Leaflet/3D map components,
   Rusty's Route page pattern) are extended, not rebuilt.

## Accessibility & Inclusion

No product-specific requirement established beyond the general commitments already in
`docs/ui-direction.md` (visible focus states, semantic structure, accessible labels, comfortable
touch targets, reduced-motion fallback for all map/route-drawing motion).
