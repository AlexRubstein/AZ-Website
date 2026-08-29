# AZAT Status Board

Living tracker of what's broken, unfinished, planned, and recently fixed on the AZAT site. Treat this like a Trello board in markdown: items move between columns as work happens.

## How to use this board

- **Before starting work:** check here first so you don't duplicate a known issue or "fix" something that's an intentional placeholder.
- **When you fix something:** move its entry from `Broken` or `Unfinished` into `Recently Resolved`, add the date and a one-line note on what changed.
- **When you find a new issue:** add it to `Broken` or `Unfinished` (whichever fits) with the date found and enough detail that someone with no other context could act on it.
- **When scope grows:** add new ideas to `Backlog` rather than letting them creep into `Unfinished`. `Unfinished` is for things already partially built; `Backlog` is for things not started.
- Keep `Recently Resolved` trimmed to the last ~10-15 entries — prune older ones or fold them into `work-done.md` once they're confirmed stable in production.

Last full audit: 2026-08-18 (live QA pass against az-website-ruddy.vercel.app) + 2026-08-18 (Firecrawl content-parity crawl of live azalpinetrail.org — see [live-site-production-diagnosis.md](live-site-production-diagnosis.md)).
Last progress check: 2026-08-29 (resources parity, town page removal, footer links, SEO pass, protected-download upload, individual segment GPX generation, and full legacy redirect map).

---

## 🔴 Broken (not working as intended)

- [ ] **Contact form doesn't deliver messages** — `/contact` submits successfully (200) and shows a confirmation, but the confirmation text literally says "Message received. Email delivery can be connected with Resend or another provider." No email provider is wired up, so submissions go nowhere. Risk: looks like it works, so nobody notices messages are being lost. Still unresolved as of 2026-08-24 (`src/app/api/contact/route.ts:10` still has the placeholder comment). *Found 2026-08-18.*

## 🚧 Unfinished / placeholder (partially built, known incomplete)

- [ ] **Wildfire alert banner code shipped, but data pipeline still unverified** — PR [#2](https://github.com/AlexRubstein/AZ-Website/pull/2) merged 2026-08-18 (`0d69096`); `Header.tsx` now wires in the banner components in production. However `/api/fire-alerts` still returns `{"active":false,"incidents":[],"updatedAt":null}` live as of 2026-08-24 — `updatedAt: null` means the NIFC/FIRMS cron has still never successfully populated real data, so the banner has never been seen displaying an actual alert. Verify the cron route/env vars are actually running in production.
- [ ] **Production ownership not transferred** — Domain, hosting, Sanity, Supabase, and credentials are still under developer accounts, not AZAT-controlled ones. Blocks real launch regardless of feature completeness. See [azat-platform-vision.md](azat-platform-vision.md).

## 📌 Next up (decided scope — not started)

Triaged out of the inventory below on 2026-08-18. Trail segments, the FAQ page, legacy redirects, protected download files, the placeholder Shop page, and the Resources external link list are done.

## 🗂️ Live-site parity inventory (PENDING TRIAGE — not yet a to-do list)

Full detail and full redirect map: [live-site-production-diagnosis.md](live-site-production-diagnosis.md). This is a raw inventory of what exists on the live WordPress site (azalpinetrail.org) that this app doesn't yet have. **"The old site has it" is not by itself a reason to rebuild it.** Nothing below should be treated as scoped work until each row has a Decision. Once decided, move `keep`/`redirect-and-defer` items into the relevant section above (🔴 Broken, 🚧 Unfinished, or 📋 Backlog) — don't leave decided items sitting in this table.

| Item | What the live site has | Decision | Notes |
|---|---|---|---|
| Redirects for retired URLs | ~50+ live URLs across towns, downloads, auth, products, news (segment-URL redirects are covered under the segment-pages item in Next Up) | ✅ Done | Added path-based redirects in `next.config.ts` so they will work when `azalpinetrail.org` points at the new app. |
| Town pages | ~19 towns (Alpine, Eagar, Forest Lakes, Greer, Hannagan Meadow, Heber-Overgaard, Holbrook, Jakes Corner, Payson, Pinedale, Pine, Pinetop-Lakeside, Punkin Center, Show Low, Strawberry, Taylor-Snowflake, Winslow, Young) | ✅ Removed | Public town pages were removed from the new site. Old town URLs redirect to `/trail`. |
| `/downloads` landing page | Gated index page before individual downloads | ✅ Redirected | `/downloads` redirects to `/resources` until/unless a dedicated index is built. |
| Old protected-download IDs | `/protected-download/2113` (GPX), `/2127` (SHP), `/2248` (KML) | ✅ Done | Redirected to the matching new protected download slugs. |
| News post bodies | Full post content for ~7 posts | ⬜ TBD | Local site has 3 posts, and even those render placeholder body text. |
| WordPress account migration | Existing rider logins | ⬜ TBD | Affects whether existing users can re-download without re-registering. |
| Stray `.com` → `.org` links | A few old embeds on the Alpine page | ✅ Not applicable | Public town pages were removed. |
| Legacy placeholder/utility pages | `/sample-page`, `/home`, `/pardon-our-dust`, `/sorry-we-are-not-accepting-users-yet`, `/category/*`, `/author/...` | ✅ Redirected | Redirected to the nearest useful current page instead of preserving WordPress-era placeholders. |

**Explicitly not a decision yet:** full commerce checkout scope and account migration are the biggest remaining cost drivers — still open.

## 📋 Backlog (planned, not started)

- [ ] Six-region planning structure (replace/augment segment-only view).
- [ ] Fuel/lodging/service map layers + connector routes.
- [ ] Itinerary generator (start town, direction, daily mileage, fuel range → candidate plan).
- [ ] TrailWatch-style rider-submitted trail condition reporting (needs moderation model first).
- [ ] Business/partner listings, event registration.
- [ ] Data-pilot phase: GPX mileage extraction + verified town/service inventory for one pilot region (Alpine/Springerville/Greer/Show Low). See [azat-next-steps-pitch-plan.md](azat-next-steps-pitch-plan.md).
- [ ] Invoicing — no invoice has been created for work done so far.

## ✅ Recently resolved

- [x] **Resources external link list added.** `/resources` now includes the official rider links from the migrated FAQ/live-site capture: AZAT OHV info, Arizona Game and Fish, ADOT, State Land, USFS MVUM, forest alerts, and Arizona 511. *Resolved 2026-08-29.*
- [x] **Town pages removed.** Deleted `/towns` and `/towns/[slug]`, removed active links to those pages, and redirected old town URLs to `/trail`. *Resolved 2026-08-29.*
- [x] **Footer contact/social links added.** Footer now includes Contact, Facebook, and a Facebook group discovery link alongside nonprofit identity text. *Resolved 2026-08-29.*
- [x] **SEO metadata pass completed.** Added stronger default metadata plus page-level titles, descriptions, canonical paths, Open Graph fields, and noindex rules for private/auth/download utility pages. *Resolved 2026-08-29.*
- [x] **Full legacy redirect map added.** Added 93 path-based redirects in `next.config.ts` covering the captured WordPress/WooCommerce URL inventory: route aliases, old A/B segment codes, towns, product/category URLs, old protected download IDs, old news slugs, auth/account paths, PDFs, and placeholder utility pages. Verified against `.firecrawl/azat-live-urls.json` with no uncovered old paths needing a decision; production build passes. *Resolved 2026-08-29.*
- [x] **Shop placeholder and navigation added.** `/shop` now intentionally ships as a simple "Shop coming soon" placeholder, and the shared header/footer include Shop links. Old WooCommerce product/category URLs redirect to `/shop` until commerce scope is revisited. *Resolved 2026-08-29.*
- [x] **Trail segment pages built — all 28, real content.** Commits `541bec2` (trail hub + Rye Creek, 2026-08-22) and `00069a8` (remaining 27 segments + Sanity media, 2026-08-23). Replaces the old A Route/B Route summary cards with a real trail hub (`/trail` — Mapbox 3D terrain synced to a searchable/filterable segment list with difficulty and mileage) plus 28 individual segment pages (`/trail/[slug]`, real named slugs like `rye-creek`, `tonto-basin`, `cherry-creek` — not the old A01–B17 numbering), each with real photos, facts, amenities, safety content, and a protected GPX download. Photos and segment docs are hosted in Sanity so they're editable from Studio. Verified live on production 2026-08-24.
- [x] **Protected downloads seeded and uploaded.** Generated 28 individual segment GPX files from the full trail GPX, added reusable `downloads:segments` and `downloads:upload` scripts, uploaded the three full-route files plus all 28 segment files to the private Supabase `protected-downloads` bucket, and verified all 31 `download_files` rows are queryable by both service role and the public active-metadata policy. *Resolved 2026-08-29.*
- [x] **FAQ page — full ~80-question migration.** Commit `98c10cc` (2026-08-18) + `930ad6c` (nav links). Replaced the 3-question placeholder with the real FAQ pulled from the live site: unified search, sticky category rail (11 sections), a persistent emergency-procedure callout, and a global legal disclaimer. Verified live on production 2026-08-24.
- [x] **Three UI bugs fixed.** Commit `3139d78` (2026-08-23): removed dead town markers/CSS from the 3D Mapbox view and homepage Leaflet map; fixed the segment photo gallery yanking the whole page to the top on auto-advance (was calling `scrollIntoView()`, which walks every scrollable ancestor — now scrolls the gallery's own strip via `scrollTo()`); fixed the invisible white-on-white "Take the route file with you" button on Rusty's Route (a Tailwind class-order/cascade bug in `DownloadButton`'s color prop).
- [x] **Untracked docs committed.** `git status` is clean as of 2026-08-24 — the docs flagged as untracked on 2026-08-18 are now in the repo.

---

### Format for new entries

```md
- [ ] **Short title** — What's wrong/missing, where (route or file), and any relevant context. *Found YYYY-MM-DD.*
```

When resolved, move to Recently Resolved as:

```md
- [x] **Short title** — one-line note on the fix. *Resolved YYYY-MM-DD.*
```
