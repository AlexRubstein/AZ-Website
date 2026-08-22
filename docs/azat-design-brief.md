# AZAT Website Design Brief — Designing Toward the Itinerary-Planning Future

Prepared July 2026. This is a working brief for producing polished, forward-looking website
design concepts to pitch to the Arizona Alpine Trail (AZAT) board. It is meant to be handed to a
design process (human or AI) with everything needed to design real screens grounded in real
content — no lorem ipsum, no invented brand colors, no guessed data model.

The pitch goal is not "make it pretty." It is: **show the board a credible, board-safe vision of
AZAT as a trip-planning platform**, where the homepage and key screens are already shaped around
letting a rider plan a real trip — even before the automated generator exists behind them.

---

## 1. What AZAT is (one paragraph, for grounding)

Arizona Alpine Trail (AZAT) is a 501(c)(3) nonprofit that develops, maintains, and promotes a
~704-mile OHV (UTV / ATV / motorcycle / truck) trail loop through the high country of Eastern
Arizona — Alpine, Greer, Show Low, Heber-Overgaard, Payson/Pine, Tonto Basin, Young, and the
Mogollon Rim corridor. The board president is Jerry Smith. The current live prototype is at
[az-website-ruddy.vercel.app](https://az-website-ruddy.vercel.app/), built in Next.js with Sanity
CMS and Supabase auth for protected route-file downloads.

## 2. The one job the design must serve

A rider should be able to: **pick a trail, understand a realistic day-by-day plan, and eventually
generate a custom itinerary themselves.** Every screen in this pitch should visibly serve that job
— not "browse content about the trail," but "plan my actual trip." Concretely, the site should let
a rider answer:

- Where can I start, and which direction should I ride?
- How many days do I need, and what's a realistic daily distance for my group/vehicle?
- Where can I get fuel, and where can I sleep each night?
- What should I download before I go, and what's changed since I last checked?

## 3. Positioning guardrails — how far the design should reach

The board is cautious (see governance concerns below). The design should look ambitious and
forward-looking, but the copy and feature framing must stay **board-safe**. This shapes what the
mockups should say and imply.

**Safe to design as a confident vision:**
- A trip-planner-shaped homepage and IA (start town, direction, days, pace/vehicle, lodging vs.
  camping as primary inputs)
- A "candidate itinerary" output screen fed by curated/verified data, clearly labeled as such
- Rusty's Route 1000 as the flagship worked example of what the generator produces
- Real fuel/lodging/mileage data with visible "last verified" freshness signals

**Do not design as already real / do not overpromise in copy:**
- A fully automatic "AI travel agent" that plans anything anywhere (avoid this language entirely)
- Real-time safety, closure, or condition authority (always: "verify with agency" links)
- Booking/payment flows or paid partner placements (not yet — no monetization UI in this pass)
- Rider-submitted trail condition reports / TrailWatch (later phase, needs moderation ownership first)

Good names for this pitch: "AZAT Trip Planner," "AZAT Planning Preview," "Plan Your Route."
Avoid: "AI itinerary generator," "Google Maps for AZAT," "Yelp for the trail."

## 4. Brand system — use these tokens exactly

Pulled directly from the current codebase (`src/app/globals.css`) and `docs/ui-direction.md`. Do
not invent a new palette or typeface direction — extend this one.

| Token | Hex | Use |
|---|---|---|
| `forest-deep` | `#08130d` | Darkest ground — hero handoffs, footer, map overlays |
| `forest` | `#173d2b` | Primary dark UI surfaces |
| `pine` | `#235840` | Secondary green, interactive states |
| `clay` | `#b74f32` | Primary warm accent — CTAs, focus states, emphasis |
| `ochre` | `#b87939` | Supporting warm accent |
| `sun` | `#f1b65a` | Supporting warm accent, route lines, hover states |
| `paper` | `#fffdf7` | Main light content surface |
| `cream` | `#f8f4e8` | Alternate light surface |
| `stone` | `#d8ded4` | Borders, dividers |
| `muted` | `#5f6c63` | Secondary body text |
| `sky` | `#6ca7c7` | Sparing natural accent — never the dominant hue |

**Typography roles** (already established, keep them):
- Big hero/section titles: condensed display font (`Arial Narrow` / `Roboto Condensed` / `Oswald`
  stack), uppercase, zero or positive letter-spacing (never negative)
- Body and UI text: Geist Sans
- Kickers, metadata, map labels, small utility text: Geist Mono, uppercase, generous positive
  letter-spacing

**Imagery**: Use only real AZAT photography — `public/azat/photos/`, `public/azat/images/`,
`public/azat/ride/`, and the brand mark at `public/azat/brand/azat-logo.png`. Real dirt trail,
terrain, riders, forest, and town context only. No stock photography, no abstract gradients or
decorative blobs, no vague atmospheric crops.

**Voice / visual north star**: "A field guide for riders. A scenic trail journal. A practical
planning tool. A community and stewardship project." Rugged, practical, scenic, trustworthy —
never generic SaaS/startup styling, never oversized empty marketing hero copy.

**Explicit do-not list** (from `docs/ui-direction.md`, still binding):
- No abstract gradients, decorative blobs, or SVG-only scenery
- No large rounded marketing cards or nested cards
- No negative letter-spacing anywhere
- No motion without a `prefers-reduced-motion` fallback
- No generic landing-page filler sections that delay useful trail information
- Small card radii only (4–8px); avoid floating decorative card stacks

## 5. Real content to design with

### 5.1 Rusty's Route 1000 — the flagship itinerary (use this data verbatim in mockups)

11-day, ~1,000-mile hotel-based loop, start/finish in Alpine, flexible start town, clockwise or
counterclockwise. This is both real content *and* the closest existing example of what the future
itinerary generator's output should look like — design the "generated itinerary" screen as an
evolution of this page, not a new invention.

| Day | Route | Via | Miles | Fuel | Lodging |
|---|---|---|---|---|---|
| 01 | Alpine → Greer | FR 1122 | ~100 | Eagar | Lazy Trout Lodge |
| 02 | Greer → Show Low | — | ~85 | Show Low | Days Inn |
| 03 | Show Low → Heber-Overgaard | FR 504 | ~100 | Show Low, Heber | Sawmill Inn |
| 04 | Heber-Overgaard → Pine | — | ~110 | Pine | The Strawberry Inn |
| 05 | Pine → Punkin Center | — | ~80 | Tonto Basin | Punkin Center Lodge |
| 06 | Punkin Center → Young | FR 288 | ~90 | Young | Pleasant Valley Inn |
| 07 | Young → Heber-Overgaard | Black Canyon Rd | ~90 | Heber | Sawmill Inn |
| 08 | Heber-Overgaard → Show Low | — | ~90 | Show Low | Days Inn |
| 09 | Show Low → Greer | FR 1122 | ~85 | Big Lake or Eagar | Lazy Trout Lodge |
| 10 | Greer → Hannagan Meadow | FR 576 | ~85 | Big Lake | Hannagan Lodge |
| 11 | Hannagan Meadow → Alpine | — | ~85 | Alpine | Trip ends |

Known-before-you-go facts already written (use verbatim, they encode real planning logic):
- **Flexible route**: start in Alpine, Show Low, Payson, or Heber-Overgaard
- **Best hubs**: Alpine, Show Low, Payson, Heber-Overgaard — strongest mix of fuel/food/lodging/supplies
- **Limited lodging** (book early): Young, Heber, Punkin Center, Hannagan Meadow
- **Mileage note**: core AZAT loop is ~700 mi; Rusty's Route adds connectors, fuel stops, side roads

Map pins already defined with coordinates (design the map layer around these): Alpine
(start/finish), Greer (lodging stop), Show Low (fuel + lodging), Heber-Overgaard (hub town), Pine
(lodging stop), Punkin Center (limited lodging), Young (limited lodging), Hannagan Meadow (limited
lodging).

### 5.2 Six planning regions (from business research — use as the region layer)

| Region | Planning hubs | Limited-service stops | Rider need this region must answer |
|---|---|---|---|
| High Country / Alpine Anchor | Alpine, Eagar, Springerville, Greer | Hannagan Meadow, Big Lake, Nutrioso | Lodging, food, seasonal road info, high-elevation weather |
| White Mountains Service Hub | Show Low, Pinetop-Lakeside, Lakeside | McNary, Hondah, Vernon | Repairs, groceries, larger-group staging, medical/airport |
| Rim / Heber-Overgaard Connector | Heber-Overgaard, Forest Lakes, Clay Springs | Black Canyon area, Chevelon area | Fuel-gap planning, daily mileage calibration, Rim fire alerts |
| Payson / Pine / Strawberry Gateway | Payson, Pine, Strawberry, Star Valley | Tonto Village, Christopher Creek | Group lodging, dining, Rim Country itineraries |
| Tonto Basin / Roosevelt / Punkin Center | Tonto Basin, Punkin Center, Roosevelt | Jakes Corner, Rye | Fuel/heat planning, limited lodging, remote-service warnings |
| Young / Pleasant Valley Interior | Young, Pleasant Valley | Remote forest roads, ranch country | Realistic day planning, lodging scarcity, emergency planning |

### 5.3 Towns already live on-site (4 published today — design the template these should upgrade to)

Alpine ("high-country anchor"), Greer ("book early" lodging), Show Low ("larger services hub"),
Pine ("community gateway"). Each currently has one line of copy and a few service tags (Fuel /
Food / Lodging / Repairs) with no address, phone, hours, or distance-from-route — design the
upgraded template to a richer card (see data model below).

### 5.4 Place / service data model (already designed, not yet built — design screens assuming these fields exist)

This is the real schema drafted in `docs/azat-business-opportunity-research.md`. Any "town" or
"service" card in the design should be built to hold these fields, even where a field is empty in
this pass:

- Name, category (fuel / lodging / restaurant / grocery / repair / medical / ranger office /
  visitor center / campground / RV park / attraction / staging / agency)
- Region + town
- Distance from route, connector mileage, "practical stop type" (primary / fallback /
  emergency-only / side-trip)
- Rider attributes: OHV-friendly, trailer parking, group-friendly, late check-in, pets allowed
- Fuel type + reliability flag (unknown / seasonal / reliable / verify)
- Lodging type, estimated rooms/units, group-capacity notes, booking URL
- Repair capability, machine types supported, emergency after-hours flag
- **Verification block** (design a small, reusable UI element for this): confidence
  (low/medium/high), last-verified date, verification method — this is the trust signal every
  weak competitor in this space is missing (see §7)

### 5.5 Existing pages/assets to extend, not replace

- Homepage: hero, Leaflet map with trail-highlight carousel, mission statement, one itinerary card
- `/trail`: route list (currently 2 placeholder routes marked "PRELIMINARY")
- `/trail/3d`: **a genuinely strong, already-built Mapbox 3D terrain view** — real GPX line draped
  over satellite terrain, labeled town roles (Trailhead/Fuel/Lodging/Resupply), National Forest
  boundaries. This is the site's most modern asset today and is barely linked from navigation —
  any redesign should promote this, not duplicate it.
- `/rustys-route-1000`: the flagship itinerary page (data above)
- `/towns`, `/resources` (protected GPX/KML/SHP downloads, versioned and dated)

---

## 6. The core screen to design: the Trip Planner flow

This is the single most important design deliverable — it is the visible shape of "itinerary
generation," even before the logic behind it is real. Design it as a short, confident flow with a
few inputs and one satisfying output, modeled directly on Rusty's Route 1000's data:

**Step 1 — Start & direction**: choose a start town from the real six hub towns (Alpine, Show Low,
Payson, Heber-Overgaard, Greer, Young), clockwise or counterclockwise.

**Step 2 — Trip style**: number of days, hotel-based vs. camping-based, vehicle/group pace (a
slider or segmented control — see the Komoot pattern in §7, which changes only the *time estimate*,
not the route, so it's honest to design even before real pace modeling exists).

**Step 3 — Output**: a day-by-day itinerary in the same card shape as Rusty's Route 1000 — route,
via, miles, fuel, lodging — plus the "know before you go" warning cards (limited lodging, mileage
notes) surfaced automatically for whichever towns appear in the plan.

**Persistent element — sticky trip-summary bar**: as the rider adjusts inputs, a bar (bottom on
mobile, side rail on desktop) shows live totals — days, miles, fuel stops — and the primary
actions: Download GPX, Save trip. It should never scroll away.

Design this flow to work convincingly with **static/curated data** (exactly what exists today for
Rusty's Route) while visually implying it will become dynamic — the pitch is about the *shape* of
the product, matching the phased approach in `docs/azat-platform-vision.md` ("It can begin as
curated routes and planning guidance, then evolve into a true generator once route data is
complete enough").

---

## 7. Best-in-class UI patterns to draw from (curated for this pitch specifically)

Each pattern below is described precisely enough to design directly — not just "make it feel
modern." Chosen because they map onto the Trip Planner flow above.

- **Auto-suggested overnight stops** (Furkot) — set a daily-distance or hotel/camping target; the
  app proposes overnight towns along the route, keyed to cumulative distance. This is the closest
  existing blueprint for AZAT's itinerary output and should shape the Step 3 screen above.
- **Fitness/pace slider that changes time, not route** (Komoot) — a 5-step slider recalculates only
  the estimated day duration/realism warning, never the path itself. Safe to design now since it
  doesn't require real routing logic underneath yet.
- **Live filter chips, no submit button** (AllTrails) — pill toggles above any list (difficulty,
  days, vehicle type) that filter instantly, no page reload. Apply to Towns and Trail list pages.
- **Round-trip loop generator from one pin + target distance** (Calimoto) — since AZAT's whole
  product is a loop, "give me an N-day loop starting from Alpine" is a near-literal fit for a
  future version of Step 1.
- **Sticky trip-summary bar** (general booking-flow pattern, e.g. Airbnb) — persistent live totals
  as the plan is built; see §6.
- **Snap-to-trail route drawing** (onX Offroad, Gaia GPS) — tapping near a trail snaps to its real
  centerline rather than drawing a straight line; the aspirational long-term version of the map
  interaction, worth designing a "future state" mock of even if not built this phase.
- **Distance-buffer slider for detours** (Roadtrippers) — one slider controls how far off-route the
  map searches for lodging/fuel pins; a cheap way to make the existing Leaflet/3D map feel like a
  planning surface rather than a static viewer.
- **Named, color-coded difficulty taxonomy** (Butler Motorcycle Maps' G1/G2/G3; ski-resort
  green/blue/black convention) — content-only, no engineering required, and AZAT's `/trail` page
  currently has no rating system at all (both listed routes just say "PRELIMINARY").
- **"Last verified" freshness stamp** — a small mono-type date badge + "call ahead" flag on every
  service card, directly using the verification fields already in the schema (§5.4). This is the
  trust signal that the nearest direct competitors (Arizona Peace Trail, Arizona Trail Association)
  are missing entirely — cheap to design, high credibility payoff for the board pitch.

## 8. Screens to produce for the pitch deck

1. **Homepage** — hero + entry point into the Trip Planner (not just a map/download CTA as today)
2. **Trip Planner** — all 3 steps from §6, plus the sticky summary bar state
3. **Itinerary Result** — the upgraded Rusty's Route 1000 template, styled as "your generated plan"
4. **Trail / segment library** — with the difficulty taxonomy applied
5. **Town / service page template** — upgraded with the real schema fields and freshness stamps
6. **3D Trail terrain view** — promoted into primary navigation, shown as an already-real asset
7. **Mobile view of the Trip Planner** — this audience checks plans at trailheads with poor signal;
   mobile is not a secondary pass

## 9. What "best of the best" means for this pitch — a checklist

- [ ] Every screen answers a real rider planning question (§2), not just "looks modern"
- [ ] All copy stays within the positioning guardrails in §3 — no overpromised AI/automation claims
- [ ] All content is real AZAT data (§5) — no lorem ipsum, no invented town names
- [ ] The brand tokens in §4 are used exactly, not reinterpreted
- [ ] The Trip Planner (§6) is the design centerpiece, not one card among many
- [ ] At least 3 of the patterns in §7 are visibly present in the mockups
- [ ] The existing 3D terrain view is featured, not redesigned from scratch
- [ ] Mobile designs exist for every screen, not just desktop
- [ ] Nothing in the design implies real-time safety/closure authority or a payment/booking flow
