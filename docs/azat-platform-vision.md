# AZAT Website Platform Vision

## Purpose

This document translates recent AZAT website conversations into a clear product vision and working roadmap. It captures what the current site already provides, what Rusty and Jerry identified as the next opportunities, and how the project can move from a successful website prototype toward a practical trail-planning platform.

The core idea is simple: Arizona Alpine Trail should become more than a brochure on the internet. It should become the trusted digital planning companion for riders exploring Eastern Arizona.

## Background

The current WordPress site has already shown meaningful traction: riders are visiting, returning, and downloading route files. That early success revealed a larger opportunity. The next set of desired features, especially itinerary planning, interactive maps, protected downloads, rider accounts, lodging/fuel planning, and future TrailWatch-style reporting, are better suited to a custom web application than to a WordPress site assembled from plugins.

A non-WordPress prototype has been created to test this direction while keeping the existing public site live. The approach is intentionally low-risk: build the prototype, validate it with AZAT leadership and riders, and only point the live domain to the new site when the team is confident.

## What We Heard

### From Jerry

Jerry has signaled support for creating an enhanced website, pending board concurrence. He also relayed an important board requirement: AZAT must own and have access to the digital assets and operating accounts behind the new site.

AZAT should have ownership or copies of:

- Domain names.
- Source code.
- Hosting account.
- Databases.
- Documentation.
- Login credentials.
- Deployment procedures.
- Backup files.

The recommended operating model is that AZAT credentials and accounts are used for production hosting, database, CMS, and related services, with developer access granted as needed.

### From Rusty

Rusty responded to the prototype as a larger platform opportunity. He described the new direction as more than a website: it could become a trail planning platform and eventually a bridge toward an app-like experience.

Rusty identified several product ideas:

- Interactive itinerary planning.
- Lodging recommendations by segment or route area.
- Fuel range calculations.
- Segment profiles.
- Photo galleries.
- Trail conditions.
- TrailWatch reporting.
- User stories and rider spotlights.
- Event registration.
- Business and partner listings.

He also gave concrete route-planning feedback: the most important rider constraints are gas, hotels, point-to-point mileage, auxiliary fuel range, group size, and realistic travel pace. The current segment concept is useful for broad orientation, but riders planning a real trip may think more naturally in terms of days, towns, fuel, lodging, and route rhythm.

## Product North Star

Arizona Alpine Trail should be a practical, beautiful, and trustworthy planning platform for off-highway riders.

The site should help riders answer:

- Where can I start?
- Which direction should I ride?
- How many days do I need?
- Where can I find fuel?
- Where can I sleep?
- How far is the next practical stop?
- Which files do I need to download?
- What towns, side trips, and points of interest should I consider?
- What should I know before I go?

The site should also help AZAT answer:

- Who is using the route files?
- Which content needs updating?
- Which towns and partners should be represented?
- How can route knowledge be maintained over time?
- How can the trail system support stewardship, safety, tourism, and local partnerships?

## What Exists Today

The current custom prototype already establishes a strong foundation:

- Next.js application structure for a modern, flexible web experience.
- Vercel-ready deployment path.
- Sanity CMS integration for editable content.
- Supabase authentication and protected download flow.
- Route file downloads with terms acceptance.
- A homepage oriented around the map, route downloads, mission, towns, resources, and featured routes.
- A dedicated Rusty's Route 1000 page.
- Trail, town, resource, news, contact, account, and shop page foundations.
- Real AZAT photography and brand direction.
- Project documentation for UI direction, deployment, CMS editing, protected downloads, QA, and route download workflow.

This means the project is not starting from zero. The current work already supports the core migration away from WordPress and gives AZAT a base for more advanced planning tools.

## Vision Pillars

### 1. Route Planning as the Main Experience

The website should make planning a ride the primary experience, not a secondary feature.

Future planning tools should support:

- Start town selection.
- Clockwise or counterclockwise travel.
- Single-day, weekend, loop, and multi-week trip styles.
- Hotel-based and camp-based planning modes.
- Suggested hub towns such as Alpine, Show Low, Payson, and Heber-Overgaard.
- Practical warnings for limited lodging towns such as Young, Punkin Center, Hannagan Meadow, and other constrained stops.
- Mileage ranges and realistic travel pacing.
- Exportable or printable itinerary summaries.

The first version does not need to solve every itinerary automatically. It can begin as curated routes and planning guidance, then evolve into a true generator once route data is complete enough.

### 2. Fuel, Lodging, and Services on the Map

Rusty's strongest practical feedback was that riders need help seeing gas, hotels, and connectors in relation to the trail.

The map should eventually include:

- Fuel stops.
- Lodging.
- Food and supplies.
- Repair/service options.
- Connector routes to towns and services.
- Town hub markers.
- Limited-service warnings.
- Segment or region overlays.

The goal is not only to show the route, but to show whether a route plan is practical.

### 3. Regions Instead of Only Segments

AZAT is working toward six ride areas for the 704-mile main loop. Those regions can become a better planning layer than purely technical segments.

Recommended structure:

- Keep segments for route file organization and technical reference.
- Introduce six rider-facing regions for planning, tourism, and partnership storytelling.
- Let each region have towns, services, featured rides, photo galleries, safety notes, and partner opportunities.
- Use regions to help townships understand how they fit into the larger trail economy.

### 4. Featured Itineraries and Rider Stories

Rusty's Route 1000 is a strong proof of concept because it turns the route into a real story riders can understand.

Future featured itineraries could include:

- Rusty's Route 1000.
- A first-timer weekend route.
- A Show Low base camp route.
- A Payson base camp route.
- A high-country summer route.
- A hotel-based full-loop itinerary.
- A camping-focused full-loop itinerary.

Each itinerary should include:

- Days.
- Mileage.
- Start/end points.
- Fuel notes.
- Lodging notes.
- Map context.
- Download links.
- Photos or story content.
- Practical warnings.

### 5. Protected Downloads and Rider Accounts

Protected downloads are already part of the prototype. This should remain a major part of the platform because route files have safety, liability, and version-control implications.

Future download improvements:

- Show current route file versions.
- Record terms acceptance.
- Track which files are downloaded.
- Provide update notices when files change.
- Offer GPX, KML, shapefile, and map-related downloads from one clear resource hub.
- Eventually let signed-in riders save trips or preferred downloads.

### 6. Trail Conditions and TrailWatch

Rusty mentioned TrailWatch reporting and the value of GIS overlays. This can become a later-stage platform feature.

Possible future capabilities:

- Public trail condition notices.
- Admin-managed alerts.
- Rider-submitted observations.
- Moderated "see something, say something" reports.
- Jurisdiction-aware reports using GIS overlays.
- Integration with forest road numbers, ranger districts, county lines, town limits, fire districts, medical resources, and other relevant map layers.

This should be phased carefully because reporting workflows need moderation, data quality, and clear responsibility.

### 7. Community, Partners, and Events

The site can also become a community and economic development tool for Eastern Arizona.

Potential features:

- Business and partner listings.
- Town pages with fuel, lodging, restaurants, repairs, supplies, and local attractions.
- Event registration.
- News and updates.
- Rider stories.
- Photo galleries.
- Partner pages for towns, tourism offices, state agencies, and trail organizations.

## Recommended Path Forward

### Phase 1: Stabilize the New Site Foundation

Goal: prepare the custom site to replace WordPress when AZAT is ready.

Work:

- Confirm board approval for the custom site direction.
- Confirm production ownership model using AZAT-controlled accounts.
- Finalize Vercel hosting setup.
- Finalize Supabase authentication and protected downloads.
- Finalize Sanity CMS access for editable content.
- Verify domain transition plan for `azalpinetrail.org`.
- Document deployment, credentials, backups, and emergency recovery.
- QA core pages on desktop and mobile.

Outcome: AZAT has a modern site it owns and can safely launch.

### Phase 2: Build the Planning Content Layer

Goal: make the site more useful for riders before building a complex itinerary engine.

Work:

- Expand Rusty's Route 1000 into a polished itinerary model.
- Create additional curated itinerary pages.
- Build town and service pages with fuel, lodging, food, supplies, and repair notes.
- Define the six ride regions and create region pages.
- Add planning warnings for limited lodging, long fuel gaps, and pace constraints.
- Improve route downloads and resource organization.

Outcome: riders can use the site to plan realistic trips even before automation exists.

### Phase 3: Improve the Interactive Map

Goal: make the map a planning tool, not just a route viewer.

Work:

- Add fuel and lodging markers.
- Add connector routes to services.
- Add hub town markers.
- Add region overlays.
- Add mileage and planning notes where data is available.
- Add map filters for riders: fuel, lodging, towns, downloads, regions, warnings.
- Begin incorporating forest road numbers and jurisdiction layers as verified data becomes available.

Outcome: riders can understand the relationship between route, services, towns, and trip feasibility.

### Phase 4: Develop Itinerary Generation

Goal: move from curated examples to interactive planning.

Work:

- Define the data model for route legs, towns, fuel, lodging, mileage, constraints, and travel modes.
- Let riders choose start point, direction, daily mileage preference, hotel/camping preference, and fuel range.
- Generate draft itineraries with warnings.
- Allow manual adjustments.
- Provide printable/exportable summaries.
- Consider saved plans for signed-in users.

Outcome: AZAT becomes a true route-planning platform.

### Phase 5: Add TrailWatch and Community Features

Goal: support stewardship, conditions, partnerships, and community storytelling.

Work:

- Add admin-managed trail condition notices.
- Add moderated rider reports.
- Add event registration if needed.
- Add partner/business listing workflows.
- Add story and photo gallery workflows.
- Explore deeper GIS overlays once source data is verified.

Outcome: the platform supports both riders and the organizations maintaining and promoting the trail.

## Data Needed

The most important constraint is data quality. The planning tools will only be as good as the route and service data behind them.

Priority data needs:

- Final route files and version history.
- Six ride region boundaries.
- Town/service list with fuel, lodging, food, supplies, and repairs.
- Connector routes from the AZAT to services.
- Mileage between practical stops.
- Lodging limitations and booking notes.
- Fuel range warnings.
- Verified forest road numbers.
- Jurisdiction overlays where available.
- Photos for towns, regions, routes, and itinerary pages.
- Partner/business information.

## Governance and Ownership

AZAT should remain the owner of the platform.

Recommended governance:

- AZAT owns the domain.
- AZAT owns production hosting.
- AZAT owns the database and CMS.
- AZAT owns source code access.
- AZAT has documented credentials and recovery procedures.
- Developers are granted access by AZAT rather than owning core accounts.
- Backups and deployment procedures are documented.
- Route file updates have a clear approval process.
- Public safety and condition updates have named owners.

This addresses the board's concern and keeps the project sustainable beyond any one developer.

## Success Measures

Near-term success:

- Board approves the custom site direction.
- AZAT-controlled production accounts are established.
- The new site launches without losing current functionality.
- Route downloads remain protected and easy to use.
- Rusty's Route and core planning pages are clear and useful.

Medium-term success:

- Riders can choose a region, town, or itinerary and understand how to plan a practical trip.
- The map includes fuel, lodging, towns, and connector context.
- AZAT can update key content through the CMS.
- Downloads and route file versions are managed cleanly.

Long-term success:

- Riders can generate or customize trip plans.
- AZAT can publish trail conditions and alerts.
- Towns and partners are represented in useful, maintainable ways.
- The platform becomes a trusted source for planning Eastern Arizona off-highway travel.

## Immediate Next Steps

1. Get board confirmation for continuing the enhanced custom website.
2. Decide which AZAT-controlled accounts should be used for production hosting, database, CMS, and repository access.
3. Confirm the six ride regions and gather the best available maps.
4. Build a service inventory for towns, fuel, lodging, food, repairs, and supplies.
5. Expand the Rusty's Route 1000 page into the template for future curated itineraries.
6. Prioritize map improvements around fuel, lodging, towns, and connector routes.
7. Document the launch and ownership process before replacing the current WordPress site.

