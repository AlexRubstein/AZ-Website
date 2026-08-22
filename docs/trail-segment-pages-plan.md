# Trail & Segment Pages Plan

## Purpose

This is the build plan for replacing the placeholder `/trail` and `/trail/[slug]` pages with a real
trail hub and 28 individual segment pages. It follows the FAQ work as the next scoped build off the
[status board](status-board.md), and corrects that board's stale assumption of an A/B-route split.

Decisions locked in with Alex before writing this plan:

- **No A/B route split.** One flat, numbered list of segments — matches the live site's actual
  "Select A Trail Segment" picker (which the earlier status-board note misread as A01–A13/B01–B17).
- **28 segments total**, not 30 slots. The live picker shows 01–18, 20, 21, 23–30 — numbers 19 and 22
  are gaps (retired or never assigned), netting 28 real segments.
- **Native branded map, not embedded Google My Maps.** Segment pages render real GPX geometry in the
  site's own Leaflet/3D components — no more third-party map chrome.
- **Publish only what's real.** Segments with confirmed final route data get a full page now.
  Everything else shows an honest "in development" status — no empty "Coming Soon" placeholder pages.
- **More photography exists off-site** (AZAT Facebook, Drive, rider submissions) and should be
  gathered — the current `public/azat` library (~25 untagged photos) is not enough on its own.

## The real segment list (from the live site)

Captured verbatim from `.firecrawl/live-the-trail.json`. Status column is what's live today —
everything except #1 is unbuilt on the live site, which is exactly why "only ship what's real"
matters here too (don't just re-embed 27 empty pages).

| # | Name | Live status |
|---|---|---|
| 01 | Rye Creek | Published |
| 02 | Tonto Basin | Coming soon |
| 03 | Juniper Canyon | Coming soon |
| 04 | Cherry Creek | Coming soon* |
| 05 | Canyon Point | Coming soon |
| 06 | Legacy Ranch | Coming soon |
| 07 | Deer Springs Lookout | Coming soon |
| 08 | Border Line | Coming soon |
| 09 | Porter Mountain | Coming soon |
| 10 | Greens Peak | Coming soon |
| 11 | Little Colorado River | Coming soon |
| 12 | Black River | Coming soon |
| 13 | Hannagan | Coming soon |
| 14 | Balke Cabin | Coming soon |
| 15 | Johns Canyon | Coming soon |
| 16 | Mamie Creek | Coming soon |
| 17 | Milligan Valley | Coming soon |
| 18 | South Fork | Coming soon |
| 20 | Canero Lake | Coming soon |
| 21 | Land Of The Pioneers | Coming soon |
| 23 | Lone Pine Dam | Coming soon |
| 24 | Maverick West | Coming soon |
| 25 | Many Draws | Coming soon |
| 26 | Chevelon Crossing | Coming soon |
| 27 | Canyon Lands | Coming soon |
| 28 | View After View | Coming soon |
| 29 | The Rim | Coming soon |
| 30 | Doll Baby | Coming soon |

\* #04 (Cherry Creek) is listed "Coming Soon" on the picker but actually has a live page at `/a04/`
with a real Google My Maps embed and GPX link — the picker widget looks stale/unmaintained. Treat
the picker's "Published/Coming Soon" labels as unreliable; the real signal is whether a segment has
an actual GPX file and route, which needs to be confirmed segment-by-segment (see Open Data
Dependencies).

**Open question to resolve with Rusty before build:** should the shipped site keep the original
numbers 1–30 (with 19 and 22 permanently absent), or renumber sequentially 1–28? Keeping the
original numbers is probably safer — if Rusty, signage, or GPX filenames already reference "Segment
24," renumbering would create a second, confusing numbering system. Recommendation: **keep the
original numbers**, just don't render slots 19/22 anywhere.

## The seamless funnel this is designed around

The whole point of this build is the path: **find the trail → find a segment → download it**, with
nothing in the way. Concretely:

1. **Home or nav → Trail hub (`/trail`).** One page, one map, one list. No dead-end "A Route / B
   Route" choice screen like today.
2. **Trail hub → a segment.** Two equivalent entry points that stay in sync: click a segment on the
   map, or click it in the list (AllTrails-style filter chips: status, difficulty — instant, no page
   reload, per `docs/azat-design-brief.md` §7).
3. **Segment page → download.** One clear, primary download action per segment, using the
   `ProtectedDownloadLink` flow that's already built and working (Supabase auth + terms + signed
   stream). This flow is solid — the fix needed is upstream of it (see Bug Fix Bundled Into This
   Work below), not a rebuild.
4. **Segment page → next segment.** Prev/next keeps riders moving through the whole trail without
   returning to the hub every time — this pattern already exists on the live site and should carry
   over.

Every step above should also sell the place, not just move data: real photography, a real elevation/
mileage/difficulty picture, and towns/fuel context where it's genuinely useful — not marketing filler
ahead of it (per `docs/ui-direction.md`: "lead future pages with usable content, not marketing
filler").

## Bug fix bundled into this work

`docs/status-board.md` already flags: unauthenticated visitors hitting `/downloads/[slug]` get
silently redirected to `/resources` with no explanation. Since "seamless downloading" is explicitly
the ask here, fix this in the same pass — redirect to `/login?next=/downloads/[slug]` (or show an
inline "sign in to download" state) instead of a silent bounce. This is a small, contained fix inside
`src/app/api/downloads/[slug]/route.ts` / the download page, not a scope expansion.

## Page 1: Trail hub (`/trail`)

Replace today's two-card placeholder with:

- **Full-bleed photographic hero** using real trail terrain (not a generic mountain stock crop) —
  matches the hero pattern already established on the homepage and Rusty's Route 1000.
- **One native map**, not a Google embed: extend the existing `LeafletRouteMap` (and surface `/trail/
  3d` prominently as "Fly the trail" — it's a genuinely strong, underused asset per the design brief)
  to draw all 28 segment lines, color-coded by status (open/preliminary/seasonal), each clickable.
- **Segment list beside/below the map**, synced to it — clicking a list row highlights the segment on
  the map and vice versa. Filter chips for status and difficulty (no submit button, instant filter —
  AllTrails pattern already named in the design brief).
- **Full-trail downloads** (Full GPX / KML / Shapefile) stay prominent at the top of this page, same
  as today's homepage/live-site pattern — this is the single highest-intent download and shouldn't be
  buried under 28 segment cards.
- Segments without real data yet show a quiet, honest "in development" tag in the list and a dimmed
  line on the map — never a dead link, never invented content.

## Page 2: Segment detail (`/trail/[number]`)

Replace today's bare mileage-tile-plus-download-tiles layout with:

- **Photo-led hero** specific to that segment where a photo exists; falls back to a shared regional
  hero image (tagged by rough geography — see Photo Strategy) rather than one generic photo reused
  site-wide like the live site does today.
- **Facts strip** (stable-width tiles per `docs/ui-direction.md`, so they don't jump on load):
  mileage, difficulty, status, and elevation gain/high point where GPX data supports it. Difficulty
  uses a simple three-tier taxonomy (Easy/Moderate/Difficult, per the Butler Maps / ski-resort
  convention already named in the design brief) — cheap, content-only, and the schema already has an
  unused `difficulty` field ready for it.
- **Native map**, not embedded Google My Maps: the segment's real GPX line rendered in the site's own
  Leaflet component (or the 3D terrain view for a "fly this segment" option), with start/end points
  and any waypoints (fuel, trailhead, hazard) already modeled in the `waypoint` schema.
- **Photo gallery/carousel** if more than one image exists for the segment — this is the actual
  "beautiful scenery" ask; a single hero photo undersells a real place.
- **One clear download action** per segment (GPX at minimum; KML/SHP if available), reusing
  `ProtectedDownloadLink` exactly as built.
- **"Last verified" stamp** — small mono-type date badge (design brief §7) on the route data and on
  the download itself, so riders know if a segment's data is fresh. Cheap trust signal, not currently
  used anywhere in the app despite being called out as a differentiator.
- **Prev/next segment nav**, skipping numbers 19/22 and any not-yet-published segments gracefully.
- Preliminary/status notices get real UI treatment (a styled notice component) instead of the live
  site's plain bold text line.

Nearby towns/fuel/lodging context is **not** in this pass (town data is itself incomplete — only 4 of
~19 towns exist today) — flagged as a natural follow-on once town pages get their own upgrade pass,
not bolted on here as a half-finished afterthought.

## Data model changes (Sanity)

`trailSegment` in `src/sanity/schemaTypes/documents.ts` already has most of what's needed. Changes:

- Drop/repurpose `routeFamily` (`"A Route" / "B Route" / "Connector" / "Side Quest"`) — no longer
  matches the flat numbered structure. Replace with a plain `segmentNumber` (number, 1–30, used for
  ordering and prev/next) alongside the existing `segmentCode`/`title`.
- Add `photos` (array of images) for the gallery, distinct from the single implicit hero.
- Add `elevationGain` / `highPoint` if/when GPX-derived data is available.
- Add `lastVerifiedAt` (date) for the freshness stamp.
- `difficulty`, `status`, `mileage`, `waypoints`, `downloads` fields already exist and are unused by
  any UI today — this build is largely about finally wiring existing schema fields into pages, not
  inventing new modeling.

## Map/GPX pipeline

The project already has `scripts/generate-route-preview.mjs` for turning route data into app-ready
assets. Extend that pattern: GPX (per segment) → simplified GeoJSON → fed into `LeafletRouteMap` and
the `/trail/3d` Mapbox view. This replaces the Google My Maps iframe entirely rather than reskinning
around it, per the native-map decision above.

## Photo strategy

Given the confirmed photo gap:

1. Gather the off-site photo library (Facebook, Drive, rider submissions) and tag by segment number
   where identifiable, otherwise by rough geography/region, so segments without a dedicated shot can
   still show something real and nearby rather than a generic crop.
2. Build the hero/gallery components to accept "segment photo → regional fallback → site-wide trail
   fallback" gracefully, so pages don't look broken while photography backfills over time.
3. Treat true per-segment photography as ongoing content work past this initial build, not a
   blocker — ship with the fallback chain in place.

## Open data dependencies (need answers before/during build, not blockers to starting)

- **GPX files per segment.** Only #04 (Cherry Creek) has been scraped/confirmed so far, and even that
  is a Google Drive share link, not a file in hand. Need to collect real GPX files (or Drive access)
  for every segment that will get a real page in this first pass.
- **Which of the 28 have final, ride-ready route data today** — this decides which segments get full
  pages in the first ship vs. show as "in development." Don't assume the live site's "Published/
  Coming Soon" labels are accurate (see the #04 discrepancy above) — confirm with Rusty directly.
- **Original numbering vs. renumbering** — recommend keeping 1–30 with gaps at 19/22 (see above);
  confirm this doesn't conflict with anything Rusty already refers to by number.

## Redirects

Once segment slugs are finalized, add redirects from every live segment URL (`/a01` … `/a13`,
`/b01` … `/b17`, per the old status-board assumption) to the corresponding new numbered slug, or to
`/trail` for any segment that isn't shipping a real page yet. This supersedes the redirect guidance
in `docs/live-site-production-diagnosis.md`, which was written under the same stale A/B assumption
this plan corrects.

## Phasing

**Phase 1 (this build):**
- Trail hub page with native map + synced filterable list + full-trail downloads.
- Segment page template (hero, facts strip, native map, gallery, download, verified stamp, prev/next).
- Real pages only for segments with confirmed route data; honest "in development" state for the rest.
- Download-redirect bug fix.
- Redirects from legacy segment URLs.

**Phase 2 (follow-on, not blocking Phase 1 ship):**
- Backfill remaining segments as GPX/photo data arrives.
- Town/fuel/lodging context surfaced on segment pages once town pages themselves get upgraded.

**Backlog (explicitly deferred per this round's decision):**
- Six-region planning layer from `docs/azat-platform-vision.md` / design brief — still the right
  long-term direction, just not this pass.

## Status-board correction

`docs/status-board.md`'s "Next up" entry for trail segment pages currently says "A01–A13, B01–B17."
That should be corrected to point at this document once this plan is agreed, so the board doesn't
keep steering future work toward a structure that isn't being built.
