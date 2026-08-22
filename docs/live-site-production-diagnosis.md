# Live Site Production Diagnosis: Arizona Alpine Trail

Date: 2026-08-18  
Live site: https://azalpinetrail.org/  
Workflow: Firecrawl QA / production content inventory

## Executive Summary

The current live site is not just a homepage plus a trail map. Firecrawl found a WordPress/WooCommerce site with public content across navigation, trail planning, protected downloads, user registration/login, 19 town-related URLs, 38 trail/route URLs, 14 product URLs, 3 product categories, multiple news posts, FAQ/OHV education pages, contact, privacy, and public PDF uploads.

The new Next.js project already has the right broad architecture for production: homepage, trail, 3D map, Rusty's Route 1000, towns, resources, downloads, auth/account, news, contact, privacy, shop/cart, Sanity, Supabase, Stripe, and fire-alert APIs. The production risk is not the route architecture. The risk is incomplete migration depth: the live site has many specific town pages, A/B trail segment pages, product pages, news posts, external resource links, and legacy URLs that are not yet fully represented in local static content or redirects.

Recommended launch posture: production can be viable after the missing inventories are either migrated, redirected, or intentionally retired in writing. Do not launch by simply pointing the domain at the new app until the redirect and content parity list below is resolved.

## Evidence Base

Firecrawl artifacts saved locally:

- `.firecrawl/azat-live-urls.json`: mapped public live-site URLs.
- `.firecrawl/live-home.json`: homepage scrape.
- `.firecrawl/live-the-trail.json`: live trail map/downloads scrape.
- `.firecrawl/live-rustys-route.json`: Rusty's Route 1000 scrape.
- `.firecrawl/live-towns.json`: towns index scrape.
- `.firecrawl/live-town-alpine.json`: representative town page scrape.
- `.firecrawl/live-resources.json`: resources page scrape.
- `.firecrawl/live-faq.json`: FAQ scrape.
- `.firecrawl/live-ohv.json`: OHV information scrape.
- `.firecrawl/live-shop.json`: shop scrape.
- `.firecrawl/live-product-mug.json`: representative product page scrape.
- `.firecrawl/live-downloads.json`: downloads/login-gated page scrape.
- `.firecrawl/live-login.json`: login page scrape.
- `.firecrawl/live-contact.json`: contact page scrape.
- `.firecrawl/live-news-expo.json`: representative news post scrape.

Collection note: a broad Firecrawl crawl hit rate limits, so this diagnosis uses a completed URL map plus focused scrapes of high-value pages.

## Live Site Inventory

### Primary Navigation

Live nav items:

- Home: `/`
- The Trail: `/the-trail/`
- Full Trail Map & Segments anchor: `/the-trail/#trail-segments`
- Rusty's Route 1000: `/rustys-route-1000/`
- Resources: `/resources/`
- About Us: `/about-us/`
- Frequently Asked Questions: `/frequently-asked-questions/`
- Shop: `/shop/`
- Log In: `/log-in/`

New build coverage:

- Has equivalent routes for Home, Trail, Route 1000, Resources, About, FAQ, Shop, Contact, account/auth.
- Header currently exposes Trail, Route 1000, Towns, Resources, News, Contact, 3D Map, and auth controls.
- Gap: live nav has explicit Shop and Log In; new header currently does not expose Shop as a primary nav item.

### Homepage

Live homepage content requirements:

- Logo and primary navigation.
- Intro nonprofit mission copy.
- Economic benefit copy.
- OHV safety copy.
- "Your gateway to Eastern Arizona Trails" CTA with Contact link.
- "See the trail" section: "28 mapped segments across Eastern Arizona's high country."
- CTA links to trail map and segments anchor.
- Mission statement attributed to Jerry Smith, President.
- Featured Rusty's Route 1000 section with 11-day / approx. 1000-mile framing.
- Latest News list with at least six posts.
- Facebook footer link.

New build coverage:

- Homepage has hero, map, mission, Rusty's Route feature, downloads, and strong visual direction.
- Gap: local homepage does not currently render the live "Latest News" feed even though content types/data exist.
- Gap: the live homepage's explicit economic benefit and OHV safety blurbs should be represented somewhere visible, either on homepage or About/Resources.

### Trail, Maps, Downloads

Live trail page requirements:

- `/the-trail/` page titled "Arizona Alpine Trail Map."
- Embedded map currently using Google My Maps plus a Leaflet segment selector.
- "Download Current Trail Files" with three protected downloads:
  - Download Full Trail GPX: `/protected-download/2113/`
  - Download Full Trail Shapefile: `/protected-download/2127/`
  - Download Full Trail KML: `/protected-download/2248/`
- Segment selector with "Full Route."
- Trail segment anchor `/the-trail/#trail-segments`.

New build coverage:

- Has `/trail`, `/trail/3d`, protected downloads, GPX/KML/SHP fallback files, Supabase-protected download flow, and a route map implementation.
- Gap: live URL `/the-trail` redirects to `/trail` only if added; current `next.config.ts` does not include `/the-trail -> /trail`, only `/the-trail-2 -> /trail`.
- Gap: protected old download URLs `/protected-download/2113`, `/protected-download/2127`, `/protected-download/2248` need redirects to the new download slugs.
- Gap: the live site claims 28 mapped segments; local `segments` only contains `A Route` and `B Route` summary cards.

### Trail Segment URLs

Firecrawl mapped these route/segment-style URLs:

- A route: `/a01`, `/a02`, `/a03`, `/a04`, `/a05`, `/a06`, `/a07`, `/a08`, `/a09`, `/a10`, `/a11`, `/a12`, `/a13`
- B route: `/b01`, `/b02`, `/b03`, `/b04`, `/b05`, `/b06`, `/b07`, `/b08`, `/b09`, `/b10`, `/b11`, `/b12`, `/b13`, `/b14`, `/b15`, `/b16`, `/b17`
- Other route/map pages: `/example-gpx-view`, `/example-esri-view`, `/the-trail`, `/plan-your-trail`, `/rye-creek`, `/the-trail-2`, `/a-route`, `/b-route`

Representative segment page `/a04/` includes:

- Title: "A04 - Cherry Creek - FR609/FR288 to FR288/FR200."
- Preliminary route notice.
- Download GPX.
- Previous/next links to adjacent segment pages.

New build coverage:

- Has a dynamic `/trail/[slug]` page, but static content only defines `a-route` and `b-route`.
- Gap: no one-to-one pages yet for `/a01` through `/a13` and `/b01` through `/b17`.
- Gap: legacy segment URLs need redirects, likely `/a04 -> /trail/a04` if individual segment pages are created, or `/a04 -> /trail` if they are intentionally retired.
- Gap: segment pages need previous/next navigation and per-segment GPX/download relationships if parity matters.

### Rusty's Route 1000

Live Rusty's Route requirements:

- `/rustys-route-1000/`
- Map with Leaflet controls.
- Anchor link to full itinerary.
- Framing: "Rusty's Route for eleven high-country days."
- Planning notes:
  - Reserve lodging before building the rest of the trip.
  - Alpine is the start, not the only start.
  - Use AZAT as backbone, then add side quests.
- Eleven itinerary legs:
  - Alpine to Greer
  - Greer to Show Low
  - Show Low to Heber/Overgaard
  - Heber/Overgaard to Pine
  - Pine to Punkin Center
  - Punkin Center to Young
  - Young to Heber/Overgaard
  - Heber/Overgaard to Show Low
  - Show Low to Greer
  - Greer to Hannagan Meadow
  - Hannagan Meadow to Alpine
- Same three protected downloads as the trail page.

New build coverage:

- Strong coverage. `/rustys-route-1000` has a detailed fallback data model, 11-day itinerary, planning notes, map highlights, and download CTA.
- Gap: verify rendered copy matches the live wording closely enough for the client, especially "Alpine is Rusty's start, not the only start" and "Use AZAT as the backbone, then add side quests."

### Towns

Live town inventory:

- `/towns`
- `/alpine`
- `/eagar`
- `/forest-lakes`
- `/greer`
- `/hannagan-meadow`
- `/heber-overgaard`
- `/holbrook`
- `/jakes-corner`
- `/payson-az`
- `/payson` appears linked from the towns index scrape.
- `/pinedale`
- `/pine`
- `/pinetop-lakeside`
- `/punkin-center`
- `/show-low`
- `/strawberry`
- `/taylor-snowflake`
- `/winslow`
- `/young`

Representative live town page `/alpine/` includes:

- Links to adjacent trail directions: Alpine Trail Northwest to Eagar and Alpine Trail Southwest to Hannagan Meadow.
- Embedded GPX Studio views.
- Local Map section.
- Information links: Alpine Action Alliance, Alpine Chamber of Commerce.
- Amenities: Alpine Tackle Shop, Lodging, Restaurants & Taverns, Alpine Country Store, Vista Auto Care, Campgrounds & RV Parks.
- Sponsors section.

New build coverage:

- Has `/towns` and `/towns/[slug]`.
- Local content currently includes only Alpine, Greer, Show Low, and Pine.
- Gap: most live town pages are missing from local static data.
- Gap: live town URLs are root-level (`/alpine`, `/greer`, etc.); new town URLs are nested (`/towns/alpine`). Redirects are needed for every legacy town URL.
- Gap: town detail pages need local map, route-direction links, amenities, external business/resource links, and sponsor slots if production parity is required.

### Resources, FAQ, OHV, National Forests

Live resources page links:

- ADOT MVD OHV Registration.
- AGFD OHV Information.
- AGFD OHV Safety Education.
- AZSP OHV Information.
- AZSP State Trust Land Information.
- GPX Viewer.
- National Forest Ranger Districts.
- Recreational OHV Association.
- Right Rider Access Fund.
- White Mountain Open Trails Association.

Live FAQ categories:

- Before Every Ride.
- Vehicles & Legal Access.
- Maps & Navigation.
- Planning Your Trip.
- Safety & Emergency Prep.
- Fuel, Lodging & Businesses.
- Understanding the AZAT.
- TrailWatch.
- Zones & Enforcement.
- Help & Contact.
- Official Resources.

Live FAQ also links to official resources including Arizona Game and Fish, ADOT, Arizona State Land Department, US Forest Service maps, Tonto/Coconino/Apache-Sitgreaves alerts, Arizona 511, AZAT downloads, Rusty's Route, OHV information, and contact email.

New build coverage:

- Has `/resources`, `/faq`, and resource/download cards.
- Gap: local FAQ currently has only three placeholder questions; live FAQ is extensive.
- Gap: resources page currently emphasizes downloads and generic cards, but does not yet visibly preserve the full external resource list.
- Gap: live `/national-forests` and `/off-highway-vehicle-ohv-information` need equivalents or redirects.

### Account, Registration, Login, Downloads

Live auth/download pages:

- `/log-in`
- `/user-registration`
- `/user-profile`
- `/downloads`
- `/account`
- `/my-account`
- `/cart`
- `/checkout`
- `/sorry-we-are-not-accepting-users-yet`

Live downloads page behavior:

- Gated content, asking users to register or reset password.
- Password rule: at least 8 characters, uppercase, lowercase, number, and one special character.

New build coverage:

- Has sign-in, sign-up, login, account, protected downloads, Supabase auth, terms agreement, and stream/download routes.
- Gap: old account/auth URLs need redirects.
- Gap: if existing users need migration from WordPress accounts, there is no evidence that migration is handled. If old accounts are not migrated, communicate that clearly before launch.
- Gap: `/downloads` itself is not present as a page; only `/downloads/[slug]` and thanks pages exist. The live site has a `/downloads` landing/auth page, so add one or redirect it to `/resources`.

### Shop And Commerce

Live shop requirements:

- WooCommerce shop at `/shop`.
- Product categories:
  - `/product-category/clothing`
  - `/product-category/housewares`
  - `/product-category/uncategorized`
- Product list found by Firecrawl:
  - Men's Premium Polo
  - Heavyweight T-Shirt with large AZAT logo on back and small logo on front
  - Men's Long Sleeve Shirt with small AZAT logo on front and large logo on back
  - Sweatshirt with large AZAT Logo on front
  - Sweatshirt with small AZAT logo on front and large logo on back
  - Unisex Hoodie with large AZAT logo on front
  - Unisex Hoodie with small AZAT logo on front and large logo on back
  - Neck Gaiter with AZAT logo
  - Socks with AZAT logo
  - Stainless Steel Water Bottle with AZAT logo
  - Mug with AZAT logo on front and back
  - White glossy mug with AZAT Logo on Front and Back
  - Flag with AZAT logo
  - Mouse pad
- Product pages include image galleries, variations/options, category links, add-to-cart/select-options flows, description, additional information, related products, previous/next product links.

New build coverage:

- Has `/shop`, `/cart`, Stripe checkout API, and webhook API.
- Current `/shop` page is only a placeholder shell.
- Gap: no product catalog, product detail routes, product images, variations, categories, add-to-cart/select-options behavior, related products, or legacy product redirects are implemented.
- Decision needed before launch: either migrate commerce fully, replace with a simpler donation/store model, or intentionally redirect old product URLs to a "shop coming soon" page.

### News And Posts

Live news/post URLs found:

- `/a-word-from-our-president`
- `/kick-off-meeting-with-logan-simpson`
- `/donation-from-waste-management-of-arizona`
- `/alpine-open-house-meeting`
- `/outdoors-sw-magazine-article-july-2023`
- `/azat-goals-and-objectives-workshop`
- `/az-game-fish-outdoor-expo`
- `/the-trail-2`
- `/a-route`
- `/b-route`
- Category/archive pages: `/category/uncategorized`, `/category/news`, `/category/about-us`
- Author page: `/author/azalpinetrailit`

New build coverage:

- Has `/news` and `/news/[slug]`.
- Local static news includes three posts: AZ Game & Fish Outdoor Expo, AZAT Goals and Objectives Workshop, Alpine Open House Meeting.
- Gap: at least four live news posts are missing from local static data.
- Gap: individual news pages currently render template placeholder text instead of migrated post body/media.
- Gap: root-level legacy post URLs need redirects to `/news/[slug]`, or dynamic routing must preserve old slugs.
- Gap: category/author archive handling should be decided: migrate, redirect to `/news`, or noindex/404 intentionally.

### PDFs And Media

Live public PDFs:

- `/wp-content/uploads/2025/03/AZAT-Map-10-19-2024-Revised-with-Logo-optimized.pdf`
- `/wp-content/uploads/2023/08/2023-08-28_alpine_open_house.pdf`

Live media requirements:

- Logo: `/wp-content/uploads/2026/06/Arizona-logo-TRAIL-color_v1.png`
- Favicon / tile images from cropped Trail Marker image.
- Product images under `/wp-content/uploads/2022/02/`.
- News images under `/wp-content/uploads/2023/` and `/wp-content/uploads/2024/`.
- Homepage/news image assets.

New build coverage:

- Has local AZAT photos, brand logo, video, and ride imagery.
- Gap: product images and some older WordPress upload assets may not be migrated.
- Gap: if PDFs are still valuable, either host them locally/Sanity/Supabase or redirect old upload URLs.

### Footer And Social

Live footer:

- Facebook link: `https://www.facebook.com/azalpinetrail`
- Copyright: "Copyright 2026 Arizona Alpine Trail, Inc. - Website Design by Alex Rubstein"
- WordPress/theme credits on live site.

New build coverage:

- Need verify footer preserves Facebook, copyright, nonprofit identity, and contact paths.
- WordPress/theme credits should be removed after migration unless contractually required.

## Priority Production Gaps

### Critical

1. Missing redirects for most live URLs.  
   Current redirects cover only `/the-trail-2`, `/about-us`, `/contact-us`, `/frequently-asked-questions`, `/privacy-policy`, `/a-route`, and `/b-route`. Add redirects for `/the-trail`, all town root URLs, all segment URLs, protected downloads, auth/account URLs, product/category URLs, and news posts.

2. Trail segment inventory is incomplete.  
   Live site exposes A01-A13 and B01-B17 plus supporting route pages. The new project only has high-level A Route and B Route cards.

3. Town inventory is incomplete.  
   Live site exposes roughly 18-19 town-related pages. The new project has only four town entries in local content.

4. Shop is placeholder-only.  
   If the client expects store continuity, this is not production ready. Either migrate products/categories/images/checkout behavior or agree to retire commerce and redirect old product URLs.

5. FAQ migration is incomplete.  
   Live FAQ is a major rider-education asset with 11 sections; new FAQ has three placeholders.

### Major

6. `/downloads` landing route is missing.  
   Live users may visit `/downloads`; new app only supports individual download slug pages.

7. Protected old download URLs are not mapped.  
   Redirect `/protected-download/2113`, `/protected-download/2127`, and `/protected-download/2248` to the new GPX/SHP/KML download flows.

8. News bodies are not migrated.  
   New news detail page currently says the page is wired as a template and instructs future migration. That should not ship as production content.

9. External resource list needs parity.  
   Preserve the live resources page links to ADOT, AGFD, AZ State Parks, GPX Studio, National Forest Ranger Districts, ROHVA, Right Rider Access Fund, and WMOTA.

10. Auth/user expectation needs a launch decision.  
   If existing WordPress users exist, decide whether to migrate accounts, ask users to recreate accounts, or launch downloads with a new authentication policy.

### Minor / Cleanup

11. Live map indicates some old embedded links use `azalpinetrail.com` instead of `.org` on the Alpine page. Correct those during migration.

12. Live site exposes `/wp-content/plugins/wpforms-lite/changelog.txt` in the URL map. This is a WordPress-era information leak and should disappear naturally after migration, but do not redirect or preserve it.

13. Placeholder/legacy pages such as `/sample-page`, `/home`, `/pardon-our-dust`, `/sorry-we-are-not-accepting-users-yet`, category pages, and author pages need intentional redirect/retirement rules.

## Recommended Redirect Map

Add or confirm these redirects before production:

- `/the-trail` -> `/trail`
- `/the-trail/` -> `/trail`
- `/the-trail-2` -> `/trail`
- `/about-us` -> `/about`
- `/our-mission` -> `/about`
- `/economic-benefits` -> `/about` or `/resources`
- `/ohv-safety` -> `/resources` or `/faq`
- `/off-highway-vehicle-ohv-information` -> `/resources` or a dedicated OHV page
- `/frequently-asked-questions` -> `/faq`
- `/contact-us` -> `/contact`
- `/privacy-policy` -> `/privacy`
- `/downloads` -> `/resources` or a new `/downloads` index
- `/protected-download/2113` -> `/downloads/arizona-alpine-trail-gpx`
- `/protected-download/2127` -> `/downloads/azat-shapefile`
- `/protected-download/2248` -> `/downloads/azat-segments-v5-kml`
- `/log-in` -> `/login` or `/sign-in`
- `/user-registration` -> `/sign-up`
- `/user-profile` -> `/account`
- `/my-account` -> `/account`
- `/account` -> `/account`
- `/checkout` -> `/cart` or new checkout route if commerce ships
- `/a01` through `/a13` -> matching `/trail/a01` through `/trail/a13`, or `/trail` if individual segment pages are deferred
- `/b01` through `/b17` -> matching `/trail/b01` through `/trail/b17`, or `/trail` if individual segment pages are deferred
- `/a-route` -> `/trail/a-route`
- `/b-route` -> `/trail/b-route`
- `/example-gpx-view`, `/example-esri-view`, `/plan-your-trail`, `/rye-creek` -> migrate or redirect to `/trail`
- Town root URLs such as `/alpine`, `/greer`, `/show-low`, `/young` -> `/towns/[slug]`
- News root URLs such as `/az-game-fish-outdoor-expo` -> `/news/az-game-fish-outdoor-expo`
- `/category/*` and `/author/azalpinetrailit` -> `/news`
- Product/category URLs -> product equivalents if commerce ships, otherwise `/shop`

## Production Checklist

- Create a content parity table for every URL in `.firecrawl/azat-live-urls.json`.
- Decide for each live URL: migrate, redirect, intentionally retire, or block/noindex.
- Add redirects in `next.config.ts` for all retired or moved live URLs.
- Expand `src/lib/content.ts` or Sanity seed data for all live towns.
- Expand segment content for A01-A13 and B01-B17, or explicitly retire individual segment pages.
- Migrate full FAQ content and preserve the 11 live FAQ categories.
- Add a `/downloads` landing page or redirect it.
- Wire old protected download IDs to the new protected download slugs.
- Decide commerce scope: full store migration, reduced shop, donation-only, or store retirement.
- If commerce ships, add product detail routes, catalog data, images, categories, variations, cart, checkout, and Stripe product mapping.
- Migrate news post bodies, images, dates, authors, and legacy slugs.
- Preserve important external resource links.
- Verify footer has Facebook, copyright, contact, privacy, and nonprofit identity.
- Verify metadata per page: title, description, canonical URL, Open Graph image, favicon.
- Run a final link check against the URL inventory after redirects are added.

## Current Build Readiness Score

Estimated readiness against live-site parity: 6/10.

Strengths:

- Strong modern architecture.
- Good route families for most concepts.
- Better auth/download architecture than the WordPress flow.
- Strong Rusty's Route 1000 coverage.
- Good foundation for Sanity-managed content and protected downloads.

Main blockers:

- Content migration is incomplete.
- Redirect coverage is incomplete.
- Store/product parity is not production ready.
- Town and trail segment depth is not production ready.
- FAQ/news pages still contain placeholder-level content.

## Rerun Inputs

workflow: firecrawl-qa  
site: https://azalpinetrail.org/  
focus: production parity, content inventory, redirects, navigation, commerce, downloads, towns, trail segments  
artifacts: `.firecrawl/azat-live-urls.json`, focused `live-*.json` scrapes
