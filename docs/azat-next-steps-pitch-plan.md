# AZAT Next Steps Pitch Plan

Date: July 15, 2026

## Purpose

This plan is for restarting momentum with AZAT leadership after a quiet period. The goal is not to pitch a finished itinerary generator immediately. The goal is to propose a clear, low-risk next phase that turns the current prototype into a real data-backed planning platform.

The strongest message:

> The site does not need another round of abstract discussion. The next useful step is to build the data foundation that would make a real AZAT trip planner possible.

## Recommended Positioning

Do not lead with "AI itinerary generator" or "business directory." Those can sound speculative, commercial, or risky.

Lead with:

- Rider safety.
- Practical trip planning.
- Accurate route and service data.
- Local business visibility.
- AZAT ownership and control.
- A measured pilot before any public launch.

Suggested framing:

> The current prototype proves AZAT can move beyond a brochure site. The next phase should be a data pilot: use the official GPX/KML route files as the source of truth, build a structured inventory of towns and services, and test whether we can help riders answer practical planning questions around fuel, lodging, mileage, repairs, and daily pacing.

## What To Do Before Pitching

### 1. Prepare a Short Written Proposal

Create a 1-2 page proposal that says:

- What exists now.
- What problem riders still have.
- What the next phase would produce.
- What AZAT would own.
- What decisions the board needs to make.

Keep it concrete. Avoid asking them to approve a big platform all at once.

### 2. Build a Small Data Demo

Before asking for a meeting, build one concrete proof point:

- Parse the GPX in the repo.
- Show route mileage and route segments.
- Pick one pilot region, preferably Alpine / Springerville / Greer / Show Low.
- Create 20-40 sample place records from public sources.
- Add fields for source URL, confidence, last verified, service category, and route relevance.
- Show how a rider could filter for fuel, lodging, food, and repairs.

This does not need Google Maps yet. It should prove the model.

### 3. Build an Immersive 3D Trail View Demo

Create a separate trail-view prototype that makes the route feel tangible and exciting before the full planner exists.

Vision:

- Show the whole AZAT route in a 3D terrain-style view.
- Draw the GPX route visibly over the terrain.
- Let users tilt, rotate, zoom, and explore the corridor.
- Add town/service markers as a preview layer.
- Keep this separate from the current trail page so it can be shown as an experimental planning view.

Why this belongs before the pitch:

- It gives AZAT leadership something visual and memorable to react to.
- It proves the route file can become an immersive trail experience, not just a download.
- It supports the larger story: AZAT can become a modern planning platform grounded in real GPX data.
- It is achievable as a prototype before the full Google/business-data pipeline is complete.

Recommended implementation levels:

- MVP: create a 3D-style route preview using the existing GPX-derived route data, terrain-like styling, route line, town pins, and camera controls.
- Better demo: use Mapbox GL JS, MapLibre GL JS, CesiumJS, or deck.gl to render real 3D terrain with the AZAT GPX line draped over it.
- Later production version: add verified services, route segments, mileage, fuel/lodging filters, and offline/download links.

Important positioning:

> This is not a replacement for onX or a claim that AZAT owns a national map platform. It is an AZAT-specific 3D trail view that uses AZAT route data to help riders understand the terrain, corridor, towns, and planning context.

### 4. Create a "Data Truth" Explanation

Make it clear that Rusty's Route 1000 is not the source of truth.

Source of truth should be:

- Route geometry: AZAT GPX/KML/SHP.
- Business discovery: Google Places / official business sources / chamber sources.
- Verified rider-specific attributes: AZAT-owned data from direct calls, partner intake, and admin review.
- Closures and public-land status: official agency links and timestamped notices.

### 5. Draft an Ownership Checklist

Board concerns should be treated as a strength. Show that you heard them.

Include:

- Domain ownership.
- Source code repository access.
- Hosting account ownership.
- Sanity/Supabase or database ownership.
- Credentials and recovery procedures.
- Deployment documentation.
- Backups and export procedures.
- Admin access policies.

### 6. Ask For a Small Decision

Do not ask: "Do you want to build the whole platform?"

Ask:

> Can we approve a short data-pilot phase to determine whether a real AZAT planning platform is feasible?

That is much easier to say yes to.

## Suggested Pitch Structure

### Opening

Start with appreciation and momentum:

> I wanted to follow up because I think the prototype uncovered a bigger opportunity, but I also want to make sure the next step is practical and board-safe.

Then name the core issue:

> The website can look good, but riders still need something more useful: real answers about fuel, lodging, mileage, route connectors, food, repairs, and how to plan a realistic day on the trail.

### The Strategic Point

> I do not think we should treat any one itinerary as the source of truth. The source of truth should be the AZAT route files, real business/location data, and verified local service information.

### The Opportunity

> If AZAT owns that data layer, the site becomes more than a website. It becomes the trusted planning system for the corridor. It can help riders plan safer trips and help local businesses and towns understand how they fit into the trail economy.

### The Low-Risk Next Step

> I am proposing a data-pilot phase before any big public launch. The pilot would use the existing GPX/KML files, build a structured town and service inventory, and test one or two regions to see how well we can support real planning questions.

### What The Pilot Produces

> The pilot would produce a route-data foundation, a sample service database, a few pilot town pages, and a simple planning demo that shows fuel, lodging, food, repair options, source confidence, and verification status.

### What It Does Not Claim Yet

> It would not claim to be a finished automatic itinerary generator yet. That would be premature until fuel, lodging, connector mileage, and business data are verified.

### Ownership Assurance

> I also agree with the board's concern that AZAT should own and control the domain, source code, hosting, database, credentials, documentation, deployment procedures, and backups. I would include that as part of the production plan.

### Ask

> Would you be open to a 30-minute meeting to review a proposed data-pilot phase and decide whether this is worth moving forward?

## Suggested Follow-Up Email

Subject options:

- Next step for AZAT planning platform
- Proposed AZAT data pilot
- Moving the AZAT site from prototype to planning tool

Email draft:

```text
Hi [Name],

I wanted to follow up on the AZAT website/prototype work and suggest a practical next step.

The prototype showed that AZAT could become more than a brochure-style site, but I do not think the next step should be jumping straight into a full itinerary generator. That would only be useful if the underlying data is real and trustworthy.

My recommendation is a short data-pilot phase, paired with a visual trail-view demo:

- Use the existing AZAT GPX/KML route files as the route source of truth.
- Build a structured inventory of towns, fuel, lodging, food, repair, supplies, agencies, and tourism partners.
- Track source URLs, confidence, and last-verified dates for every important service.
- Start with one or two pilot regions.
- Produce a simple planning demo that shows what riders can realistically use: route mileage, fuel/lodging options, connector notes, and service gaps.
- Build a separate 3D trail-view prototype so riders and the board can see the full AZAT route over terrain with the GPX line visible.

This would let us evaluate the platform idea without overcommitting. It would also address the board's ownership concerns by defining what AZAT should own and control: domain, source code, hosting, database, credentials, documentation, deployment procedures, and backups.

I think this is the right bridge between the current prototype and a future planning platform.

Would you be open to a 30-minute call to review the data-pilot plan and decide whether it is worth moving forward?

Thanks,
[Your Name]
```

## What To Build First

### Build 1: Route Data Extract

Goal:

Turn the GPX in the repo into structured route data.

Outputs:

- Total route mileage.
- Named tracks/segments.
- Coordinate sequence.
- Cumulative mileage.
- Route bounding box.
- Town proximity estimates.
- Exported JSON for the app.

Why it matters:

This proves the route itself, not a story itinerary, is the foundation.

### Build 2: Place Database Schema

Goal:

Create the data model for towns and services.

Minimum entities:

- `regions`
- `towns`
- `route_segments`
- `route_points`
- `connector_routes`
- `places`
- `place_sources`
- `place_verifications`
- `service_categories`
- `alerts`

Critical fields:

- Source URL.
- Source type.
- Confidence.
- Last verified.
- Verification method.
- Rider-relevant attributes.
- Distance from route.
- Connector notes.
- Business partner status.

### Build 3: Pilot Region Inventory

Goal:

Seed one real region with public data.

Recommended pilot:

- Alpine.
- Springerville / Eagar.
- Greer.
- Show Low.

Why this region:

- It is central to AZAT identity.
- There are strong public sources.
- It includes lodging, fuel, food, high-country route context, and seasonal issues.

Seed categories:

- Fuel.
- Lodging.
- Food.
- Groceries/supplies.
- Repair.
- Medical/pharmacy.
- Visitor/tourism offices.
- Forest Service / public agency contacts.

### Build 4: Admin Review View

Goal:

Show that this will be maintainable.

Features:

- List places.
- Filter by category/town/confidence.
- See source URL.
- Mark verified.
- Add notes.
- Add rider attributes.
- Mark call-ahead required.

This is more important than a flashy public page at first.

### Build 5: Public Planning Demo

Goal:

Create a simple rider-facing proof of concept.

Features:

- Map route.
- Toggle fuel/lodging/food/repair.
- Select a town or region.
- See service cards.
- See confidence/last verified.
- See "call ahead" warnings.
- Show route mileage context.

Do not call it a full itinerary generator yet. Call it:

- AZAT Planning Data Pilot.
- AZAT Trip Planning Preview.
- AZAT Route + Services Prototype.

### Build 6: Immersive 3D Trail View

Goal:

Create a separate page that lets riders explore the AZAT route in 3D with the GPX data visible.

Features:

- Full-screen or near-full-screen 3D trail view.
- Real AZAT GPX route line drawn over terrain.
- Tilt, rotate, zoom, and pan controls.
- Route segments or region labels.
- Town markers for Alpine, Greer, Show Low, Heber-Overgaard, Payson/Pine, Young, Tonto Basin/Punkin Center, and other planning hubs.
- Optional service-preview layer for fuel, lodging, food, and repairs once the place database exists.
- A small control panel for route view, service layers, downloads, and planning notes.

Implementation options:

- Fast prototype: use existing route preview data and CSS/WebGL-style perspective to create a convincing 3D route preview.
- Real terrain prototype: use Mapbox GL JS, MapLibre GL JS, CesiumJS, or deck.gl with terrain/elevation tiles and draw the GPX route over it.
- Production path: choose the map provider after reviewing licensing, cost, attribution, offline needs, and whether AZAT needs Google, Mapbox, Esri, or open-data terrain.

Why this matters:

- It makes the trail experience more immersive.
- It helps leadership and riders understand the scale and terrain of the route.
- It creates a compelling demo for the pitch without pretending the itinerary generator is finished.
- It can later become the visual front end for the route/service database.

Pitch language:

> Alongside the data pilot, I can build a separate 3D trail-view page that uses the actual AZAT GPX route. The idea is to let riders see the whole trail draped over terrain, with towns and service layers added over time. It would make the trail feel real and explorable while still being grounded in official route data.

### Build 7: Simple Candidate Itinerary Logic

Only after route mileage and service data exist:

- Choose start town.
- Choose direction.
- Enter fuel range.
- Enter target daily mileage.
- Require lodging yes/no.
- Generate candidate overnight towns.
- Show warnings where data is incomplete.

The output should say:

> Candidate plan based on current planning data. Verify fuel, lodging, weather, closures, and route conditions before riding.

## What Not To Build Yet

Avoid building these too early:

- A fully automated "perfect itinerary" generator.
- Paid partner listings.
- Booking/referral flows.
- Rider-submitted trail reports.
- TrailWatch-style incident system.
- Public claims about real-time conditions.
- AI-generated recommendations without data confidence.

Those are later features. The first pitch should be about the data foundation.

## What The Pitch Could Be Called

Good names:

- AZAT Planning Data Pilot.
- AZAT Route + Services Pilot.
- AZAT Corridor Planning System.
- AZAT Rider Planning Platform: Phase 1.

Avoid:

- AI travel agent.
- Google Maps for AZAT.
- Yelp for the trail.
- Fully automatic itinerary generator.

## Meeting Agenda

Suggested 30-minute agenda:

1. Current status of prototype.
2. What riders need that the current site does not yet answer.
3. Why the source of truth should be real route and service data.
4. Proposed data-pilot phase.
5. Ownership and governance checklist.
6. Demo or mockup of pilot output.
7. Board decision needed.
8. Next steps and timeline.

## Recommended Ask

Ask for permission to do a limited pilot:

> Approve a short planning-data pilot focused on one AZAT region, using the official route files and public business/tourism data, with no public launch until AZAT reviews the data and ownership model.

Optional ask:

> Identify one board contact and one route/local knowledge contact to review the data model and pilot region.

## Suggested Timeline

### Week 1

- Parse GPX/KML.
- Define route data model.
- Define place database schema.
- Draft ownership checklist.

### Week 2

- Seed pilot region from public sources.
- Build admin review table.
- Add source/confidence/verification fields.

### Week 3

- Build public planning demo.
- Build separate 3D trail-view prototype using the GPX route.
- Add map toggles and service filters.
- Add route distance/service context.

### Week 4

- Review with AZAT.
- Identify gaps.
- Start direct verification calls.
- Decide whether to expand to more regions.

## Decision Tree

If AZAT responds positively:

- Schedule meeting.
- Show pilot plan.
- Ask for board-approved data pilot.
- Build pilot.

If AZAT is interested but hesitant:

- Offer a no-public-launch prototype.
- Emphasize ownership and review.
- Ask for one region only.

If AZAT does not respond:

- Build a small private demo using repo route data and public sources.
- Send a screenshot or short Loom-style walkthrough.
- Ask for a simple yes/no on whether they want to review it.

If AZAT says no to custom platform:

- Reframe the work as a data package and route-service inventory that can still support the existing website.

## Best Message To Say Out Loud

> I think the next step is not to build a flashy itinerary generator. The next step is to build the data foundation that would make one trustworthy. AZAT already has the route files. We can use those as the route source of truth, combine them with real business and tourism data, and then verify the rider-specific details that Google or chamber sites do not know, like trailer parking, fuel reliability, lodging capacity, and whether a stop is practical after a trail day. That gives AZAT something valuable whether or not the final product becomes a full planner, a town guide, a partner directory, or all three.

## Board-Safe Summary

The next phase should be a limited planning-data pilot. It should:

- Use real AZAT route files as the route source of truth.
- Use public and Google business data as discovery inputs.
- Store AZAT-owned verification data separately.
- Avoid claiming real-time safety or closure authority.
- Keep AZAT in control of ownership, credentials, code, data, deployment, and backups.
- Prove value in one region before expanding.

The pitch is simple:

> Let us prove the data foundation first. If the data works, the itinerary generator becomes realistic. If the data does not work, AZAT still gains a useful town/service inventory and a clearer platform strategy.
