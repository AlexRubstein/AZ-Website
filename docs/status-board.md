# AZAT Status Board

Living tracker of what's broken, unfinished, planned, and recently fixed on the AZAT site. Treat this like a Trello board in markdown: items move between columns as work happens.

## How to use this board

- **Before starting work:** check here first so you don't duplicate a known issue or "fix" something that's an intentional placeholder.
- **When you fix something:** move its entry from `Broken` or `Unfinished` into `Recently Resolved`, add the date and a one-line note on what changed.
- **When you find a new issue:** add it to `Broken` or `Unfinished` (whichever fits) with the date found and enough detail that someone with no other context could act on it.
- **When scope grows:** add new ideas to `Backlog` rather than letting them creep into `Unfinished`. `Unfinished` is for things already partially built; `Backlog` is for things not started.
- Keep `Recently Resolved` trimmed to the last ~10-15 entries — prune older ones or fold them into `work-done.md` once they're confirmed stable in production.

Last full audit: 2026-08-18 (live QA pass against az-website-ruddy.vercel.app) + 2026-08-18 (Firecrawl content-parity crawl of live azalpinetrail.org — see [live-site-production-diagnosis.md](live-site-production-diagnosis.md)).

---

## 🔴 Broken (not working as intended)

- [ ] **Contact form doesn't deliver messages** — `/contact` submits successfully (200) and shows a confirmation, but the confirmation text literally says "Message received. Email delivery can be connected with Resend or another provider." No email provider is wired up, so submissions go nowhere. Risk: looks like it works, so nobody notices messages are being lost. *Found 2026-08-18.*
- [ ] **Unauthenticated download links redirect with no explanation** — Hitting `/downloads/[slug]` while signed out silently redirects to `/resources` instead of to `/login` (with a return path) or showing a "sign in to download" message. A rider clicking "Download GPX" logged out just lands back on Resources with no feedback. *Found 2026-08-18.*

## 🚧 Unfinished / placeholder (partially built, known incomplete)

- [ ] **Wildfire alert banner not live** — Built (NIFC/FIRMS integration, cron route, banner UI variants) but sitting in unmerged PR [#2](https://github.com/AlexRubstein/AZ-Website/pull/2) on `codex/homepage-responsive-rhythm`. Even once merged, `/api/fire-alerts` currently returns `{"active":false,"incidents":[],"updatedAt":null}` in production — the data pipeline has never populated it, so the cron/env setup needs verifying too.
- [ ] **Shop / Cart are stubs** — Pages exist and say so explicitly ("Sanity product documents and Stripe checkout can power this when commerce is ready"). No Stripe checkout wired despite scaffolding existing. See [stripe-rollout.md](stripe-rollout.md).
- [ ] **A Route / B Route pages are preliminary** — `/trail/a-route` and `/trail/b-route` are explicitly labeled "PRELIMINARY," placeholder mileage/copy only.
- [ ] **Protected download seed files not uploaded** — Real GPX/KML/SHP files still need to go into the private Supabase Storage bucket; downloads aren't fully testable end-to-end with real files yet. See [protected-downloads.md](protected-downloads.md).
- [ ] **Production ownership not transferred** — Domain, hosting, Sanity, Supabase, and credentials are still under developer accounts, not AZAT-controlled ones. Blocks real launch regardless of feature completeness. See [azat-platform-vision.md](azat-platform-vision.md).
- [ ] **Untracked docs not committed** — `azat-platform-vision.md`, `azat-design-brief.md`, `azat-next-steps-pitch-plan.md`, `azat-business-opportunity-research.md`, `work-done.md`, and one photo asset are untracked in git as of 2026-08-18. Should be committed and pushed.

## 📌 Next up (decided scope — not started)

Triaged out of the inventory below on 2026-08-18. These three are in scope; everything else in the triage table is still pending. Not started yet — parking here with what's already known so work can resume without re-deriving it.

- [ ] **Trail segment pages (28 numbered segments, no A/B split).** Full build plan superseded and corrected in [trail-segment-pages-plan.md](trail-segment-pages-plan.md) — the "A01–A13, B01–B17" assumption below was wrong; the live site's real structure is one flat numbered list (1–30, skipping 19/22 = 28 real segments). See that doc for the segment list, native-map decision, photo strategy, schema changes, and open data dependencies (GPX files per segment, which segments have final route data).
- [ ] **FAQ page.** Full content already captured — `.firecrawl/live-faq.json` has all 11 sections (Before Every Ride, Vehicles & Legal Access, Maps & Navigation, Planning Your Trip, Safety & Emergency Prep, Fuel/Lodging/Businesses, Understanding the AZAT, TrailWatch, Zones & Enforcement, Help & Contact, Official Resources) with full Q&A text, ready to migrate as-is. No further scraping needed — this one's just a build task. Replaces the current 3-placeholder-question FAQ.
- [ ] **Resources page — external link list.** Bundled with the FAQ work since it's the same "official resources" content. Link list (ADOT MVD OHV Registration, AGFD OHV Info/Safety, AZSP OHV/State Trust Land, GPX Viewer, National Forest Ranger Districts, ROHVA, Right Rider Access Fund, WMOTA) is already captured in `.firecrawl/live-resources.json` and inside `live-faq.json`'s "Official Resources" section.
- [ ] **Shop page.** Product catalog data already captured — `.firecrawl/live-shop.json` has all 14 products with names, images, and prices/price-ranges. Only one product has a full detail scrape so far (`.firecrawl/live-product-mug.json` — shows the pattern: image gallery, size/variant selector, SKU, category, description, related products). The other 13 products would need the same detail scrape if individual product pages are being built.
  - **Open question carried over, not yet decided:** does "build the shop page" mean a product catalog/display only, or a full purchase flow (Stripe checkout wired to real products)? That changes scope a lot — checkout involves real money, pricing, shipping/fulfillment decisions that need to be confirmed before building, not assumed. Resolve this before starting the shop build.

## 🗂️ Live-site parity inventory (PENDING TRIAGE — not yet a to-do list)

Full detail and full redirect map: [live-site-production-diagnosis.md](live-site-production-diagnosis.md). This is a raw inventory of what exists on the live WordPress site (azalpinetrail.org) that this app doesn't yet have. **"The old site has it" is not by itself a reason to rebuild it.** Nothing below should be treated as scoped work until each row has a Decision. Once decided, move `keep`/`redirect-and-defer` items into the relevant section above (🔴 Broken, 🚧 Unfinished, or 📋 Backlog) — don't leave decided items sitting in this table.

| Item | What the live site has | Decision | Notes |
|---|---|---|---|
| Redirects for retired URLs | ~50+ live URLs across towns, downloads, auth, products, news (segment-URL redirects are covered under the segment-pages item in Next Up) | ⬜ TBD | Even for content we intentionally drop, a redirect (vs. a 404) is usually still worth it for SEO/bookmarks — that's a separate call from "do we rebuild this content." |
| Town pages | ~19 towns (Alpine, Eagar, Forest Lakes, Greer, Hannagan Meadow, Heber-Overgaard, Holbrook, Jakes Corner, Payson, Pinedale, Pine, Pinetop-Lakeside, Punkin Center, Show Low, Strawberry, Taylor-Snowflake, Winslow, Young) | ⬜ TBD | Local site has 4 today (Alpine, Greer, Show Low, Pine). |
| `/downloads` landing page | Gated index page before individual downloads | ⬜ TBD | |
| Old protected-download IDs | `/protected-download/2113` (GPX), `/2127` (SHP), `/2248` (KML) | ⬜ TBD | |
| News post bodies | Full post content for ~7 posts | ⬜ TBD | Local site has 3 posts, and even those render placeholder body text. |
| WordPress account migration | Existing rider logins | ⬜ TBD | Affects whether existing users can re-download without re-registering. |
| Stray `.com` → `.org` links | A few old embeds on the Alpine page | ⬜ TBD | Cheap fix if towns content is rebuilt at all. |
| Legacy placeholder/utility pages | `/sample-page`, `/home`, `/pardon-our-dust`, `/sorry-we-are-not-accepting-users-yet`, `/category/*`, `/author/...` | ⬜ TBD | Likely just retire/404, but flagging so it's a decision not an oversight. |

**Explicitly not a decision yet:** full commerce checkout scope (see Next Up), account migration, and content depth for towns are the biggest remaining cost drivers — still open.

## 📋 Backlog (planned, not started)

- [ ] Six-region planning structure (replace/augment segment-only view).
- [ ] Fuel/lodging/service map layers + connector routes.
- [ ] Itinerary generator (start town, direction, daily mileage, fuel range → candidate plan).
- [ ] TrailWatch-style rider-submitted trail condition reporting (needs moderation model first).
- [ ] Business/partner listings, event registration.
- [ ] Data-pilot phase: GPX mileage extraction + verified town/service inventory for one pilot region (Alpine/Springerville/Greer/Show Low). See [azat-next-steps-pitch-plan.md](azat-next-steps-pitch-plan.md).
- [ ] Invoicing — no invoice has been created for work done so far.

## ✅ Recently resolved

*(nothing logged yet — add entries here as items get fixed)*

---

### Format for new entries

```md
- [ ] **Short title** — What's wrong/missing, where (route or file), and any relevant context. *Found YYYY-MM-DD.*
```

When resolved, move to Recently Resolved as:

```md
- [x] **Short title** — one-line note on the fix. *Resolved YYYY-MM-DD.*
```
