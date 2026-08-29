import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

import { buildSegmentPageData, listSegmentContentSlugs } from "../src/lib/segment-content.mjs";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ymwkx711";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_AUTH_TOKEN. Create a Sanity token with write access and rerun the seed script.");
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const image = (externalUrl, alt) => ({ _type: "externalImage", externalUrl, alt });

// Uploads the actual file bytes to Sanity's asset store (not just a URL reference), so the
// resulting image is a real Sanity asset — editable/replaceable by anyone in Studio, from
// anywhere, with no code change or redeploy. `localUrl` is a site-relative path like
// "/azat/segments/rye-creek/photos/hero.jpg"; Sanity dedupes identical uploads by content hash,
// so re-running this is safe.
async function uploadLocalImage(localUrl, alt) {
  if (!localUrl) return undefined;
  const filePath = resolve("public" + localUrl);
  const buffer = readFileSync(filePath);
  const filename = localUrl.split("/").pop();
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  uploaded ${localUrl} -> ${asset._id}`);
  return { _type: "externalImage", image: { _type: "image", asset: { _type: "reference", _ref: asset._id } }, alt };
}
const slug = (current) => ({ _type: "slug", current });
const labeledItem = (label, value, description, href) => ({ _type: "labeledItem", label, value, description, href });
const planningNote = (label, text) => ({ _type: "rustysRoutePlanningNote", label, text });
const rustysDay = (day, route, via, miles, fuel, lodging) => ({
  _type: "rustysRouteDay",
  day,
  route,
  via,
  miles,
  fuel,
  lodging,
});
const mapCoordinates = (lat, lng) => ({ _type: "mapCoordinates", lat, lng });
const trailHighlight = (title, category, icon, lat, lng) => ({
  _type: "trailHighlight",
  title,
  category,
  icon,
  coordinates: mapCoordinates(lat, lng),
});

// Converts our simple { type: "p" | "quote" | "link", text, url } block shape (see
// src/lib/content.ts NewsBodyBlock) into real Portable Text blocks matching the `richText`
// schema: a quote becomes a blockquote-style block, a link becomes a normal block whose whole
// span carries a `link` markDef/annotation.
function richTextFromBlocks(blocks) {
  if (!blocks?.length) return undefined;
  return blocks.map((block) => {
    if (block.type === "quote") {
      return {
        _type: "block",
        _key: randomUUID(),
        style: "blockquote",
        children: [{ _type: "span", _key: randomUUID(), text: block.text }],
      };
    }
    if (block.type === "link") {
      const markKey = randomUUID();
      return {
        _type: "block",
        _key: randomUUID(),
        style: "normal",
        markDefs: [{ _type: "link", _key: markKey, href: block.url }],
        children: [{ _type: "span", _key: randomUUID(), text: block.text, marks: [markKey] }],
      };
    }
    return {
      _type: "block",
      _key: randomUUID(),
      style: "normal",
      children: [{ _type: "span", _key: randomUUID(), text: block.text }],
    };
  });
}

function toPortableText(text) {
  if (!text) return undefined;
  return text
    .split("\n\n")
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block",
      _key: randomUUID(),
      style: "normal",
      children: [{ _type: "span", _key: randomUUID(), text: paragraph }],
    }));
}

// Every trailSegment (+ its paired downloadFile) is built from public/azat/segments/<slug>/ —
// the same convention src/lib/trail-segments.ts reads for the code-level fallback — so a new
// segment only ever needs that one folder, never a hand-written block in this script.
// See public/azat/segments/README.md.
const trailSegmentIndex = JSON.parse(readFileSync(resolve("content/trail-segment-index.json"), "utf8"));
const segmentPublicDir = resolve("public");

const segmentDocs = [];
const segmentDownloadDocs = [];

for (const segmentSlug of listSegmentContentSlugs(segmentPublicDir)) {
  const indexEntry = trailSegmentIndex.find((entry) => entry.slug === segmentSlug);
  if (!indexEntry) continue;

  const data = buildSegmentPageData(indexEntry, { publicDir: segmentPublicDir });
  if (!data) continue;

  console.log(`Uploading photos for ${segmentSlug}...`);
  const heroImage = data.heroImage ? await uploadLocalImage(data.heroImage, data.heroImageAlt) : undefined;
  const mapImage = data.mapImage ? await uploadLocalImage(data.mapImage, data.mapImageAlt) : undefined;
  const galleryUploads = data.gallery?.length
    ? await Promise.all(data.gallery.map((item) => uploadLocalImage(item.url, item.alt)))
    : undefined;
  const gallery = galleryUploads?.map((item) => ({ ...item, _key: randomUUID() }));

  const primaryDownload = data.downloads?.[0];
  const downloadDocId = primaryDownload?.slug?.current ? `download-${primaryDownload.slug.current}` : null;

  if (downloadDocId) {
    segmentDownloadDocs.push({
      _id: downloadDocId,
      _type: "downloadFile",
      title: primaryDownload.title,
      slug: slug(primaryDownload.slug.current),
      fileType: primaryDownload.fileType,
      version: "v1",
      notes: primaryDownload.notes,
    });
  }

  segmentDocs.push({
    _id: `trail-segment-${segmentSlug}`,
    _type: "trailSegment",
    title: data.title,
    slug: slug(segmentSlug),
    segmentCode: data.segmentCode,
    segmentNumber: data.segmentNumber,
    status: data.status,
    lengthMiles: data.lengthMiles,
    minElevationFeet: data.minElevationFeet,
    maxElevationFeet: data.maxElevationFeet,
    elevationGainFeet: data.elevationGainFeet,
    elevationLossFeet: data.elevationLossFeet,
    trailRating: data.trailRating,
    downloads: downloadDocId ? [{ _type: "reference", _ref: downloadDocId, _key: randomUUID() }] : undefined,
    heroImage,
    mapImage,
    descriptionBody: toPortableText(data.descriptionBody),
    amenities: data.amenities,
    amenitiesNote: data.amenitiesNote,
    safetyNote: data.safetyNote,
    pointsOfInterest: data.pointsOfInterest,
    gallery,
    lastVerifiedAt: data.lastVerifiedAt,
    seo: data.seo ? { _type: "seo", ...data.seo } : undefined,
  });
}

// Mirrors src/lib/content.ts `news` (the fallback array). Kept as a plain hand-duplicated list
// here — same convention as every other seed section in this file — rather than importing the
// .ts module, since this script runs directly under plain Node with no TS loader.
const newsPostSource = [
  {
    id: "news-rusty-1000-ambassador-ride",
    title: "The 'Rusty 1000': Where Every Mile Tells a Story",
    slug: "rusty-1000-ambassador-ride",
    publishedAt: "2026-07-28T12:00:00Z",
    category: "In the Press",
    excerpt:
      "AZAT board member Rusty Childress spent 11 days and more than 1,000 miles circling the Arizona Alpine Trail solo on an ATV, documenting conditions and meeting the communities along the way.",
    heroImage: "/news/rusty-1000-alpine-sign.jpg",
    heroImageAlt:
      "Rusty Childress raises his arms beside his ATV at the \"Welcome to Alpine\" trailhead sign, marking the start of his 1,000-mile Arizona Alpine Trail ambassador ride.",
    body: [
      { type: "p", text: "What if one 700-mile trail could lead you from alpine forests to desert canyons, from roadside cafés to hidden overlooks, and from bands of wild horses to communities many travelers pass by without ever stopping?" },
      { type: "p", text: "That's what Arizona Alpine Trail board member and Alpine photographer Rusty Childress discovered during his 11-day solo ATV ambassador ride, a journey that stretched into more than 1,000 miles as he documented trail conditions, met residents, and showcased the communities connected by the trail." },
      { type: "quote", text: "The 'Rusty 1000' name wasn't about setting a mileage record: it was about exploration." },
      { type: "p", text: "Traveling counterclockwise from Alpine through Greer, Show Low, Heber, Strawberry, Tonto Basin and Young before looping back, Childress watched the landscape transform from 10,000-foot spruce and fir forests to cactus-covered desert, all in the same trip. Along the way he met with local business owners, shared the Arizona Alpine Trail Master Plan, and talked with Game and Fish, county sheriff's offices, and the U.S. Forest Service about responsible, managed recreation." },
      { type: "quote", text: "The trail connects remarkable landscapes, but it also connects the small towns, businesses, history and people that make this region such a unique place to explore." },
      { type: "p", text: "The ride is part of the same effort behind our ongoing \"Segment Spotlight\" series, which is unveiling all 28 segments of the trail one at a time on our Facebook page." },
    ],
    source: {
      label: "White Mountain Independent",
      url: "https://www.wmicentral.com/news/the-rusty-1000-where-every-mile-tells-a-story/article_70368652-25d9-489f-8584-5d72159636a0.html",
      reporter: "Toni Gibbons",
      photoCredit: "Rusty Childress",
    },
  },
  {
    id: "news-az-game-fish-outdoor-expo",
    title: "AZ Game & Fish Outdoor Expo!",
    slug: "az-game-fish-outdoor-expo",
    publishedAt: "2025-03-28T12:00:00Z",
    category: "Community & Events",
    excerpt:
      "AZAT joins the Arizona Game and Fish Department's Outdoor Expo at Ben Avery Shooting Facility in Phoenix, the state's largest hands-on outdoor expo.",
    heroImage: "/news/az-game-fish-expo-2025.png",
    heroImageAlt: "A girl smiles while holding up a fish she caught at the Arizona Game and Fish Outdoor Expo family fishing tank.",
    body: [
      { type: "p", text: "Come visit us and learn more about the Arizona Alpine Trail at the expo! The largest hands-on outdoor expo in Arizona is at the Ben Avery Shooting Facility in Phoenix. The Arizona Game and Fish Department's Outdoor Expo features everything from wildlife exhibits to family fishing tanks to trying out firearms in a safe, controlled environment on the range." },
      { type: "p", text: "The expo runs 9 a.m. to 3 p.m. on Saturday, March 29, 2025, and 9 a.m. to 3 p.m. on Sunday, March 30, 2025." },
      { type: "link", text: "More information on the Outdoor Expo", url: "https://www.azgfd.com/event/outdoor-expo-2025/" },
    ],
  },
  {
    id: "news-outdoors-sw-magazine-article-july-2023",
    title: "Outdoors SW Magazine Article July 2023",
    slug: "outdoors-sw-magazine-article-july-2023",
    publishedAt: "2023-09-06T12:00:00Z",
    category: "In the Press",
    excerpt: "A short feature on Arizona Alpine Trail appears in the July 2023 issue of Outdoors SW Magazine.",
    heroImage: "/news/outdoors-sw-magazine-cover.png",
    heroImageAlt: "Cover of the July 2023 issue of Outdoors SW Magazine, featuring a great blue heron.",
    body: [{ type: "p", text: "A short article was published about us in Outdoors SW Magazine." }],
    source: {
      label: "Outdoors SW Magazine, \"Pardon Our Dust: Building the Arizona Alpine Trail,\" July 2023, page 22",
      reporter: "Jen Rinaldi",
    },
  },
  {
    id: "news-alpine-open-house-meeting",
    title: "Alpine Open House Meeting",
    slug: "alpine-open-house-meeting",
    publishedAt: "2023-08-30T12:00:00Z",
    category: "Community & Events",
    excerpt: "AZAT thanks the Apache-Sitgreaves National Forest for hosting an Alpine community open house on the trail's early planning.",
    heroImage: "/news/alpine-open-house-2023.jpeg",
    heroImageAlt: "Community members seated in a meeting hall listening to a presentation during the Alpine open house discussion.",
    body: [
      { type: "p", text: "Arizona Alpine Trail, Inc. (AZAT) would like to thank the Apache-Sitgreaves National Forest (ASNF) for assembling an open house discussion with the Alpine community on Monday, August 28th, 2023." },
      { type: "p", text: "Over 30 community members attended to ask questions, address concerns, and propose ideas about how Alpine will be connected to the Alpine Trail. Such feedback is very much appreciated and essential for success. As mentioned during the meeting, the formation of the trail is still in its initial phases. Funding for the creation of a Master Plan has been obtained and work on the plan has begun." },
      { type: "p", text: "Many future community discussions will be scheduled as part of generating the Master Plan, which should take about a year to complete." },
      { type: "p", text: "This website, although still being constructed, will be the best source for the latest news and information. If anyone has specific questions, feel free to visit our Contact Us page and submit them. Thank you." },
    ],
  },
  {
    id: "news-donation-from-waste-management-of-arizona",
    title: "Donation from Waste Management of Arizona",
    slug: "donation-from-waste-management-of-arizona",
    publishedAt: "2023-07-24T12:00:00Z",
    category: "Partner & Agency News",
    excerpt: "AZAT thanks Waste Management of Arizona for a generous donation supporting trail cleanup costs.",
    heroImage: "/news/waste-management-logo.jpg",
    heroImageAlt: "Waste Management of Arizona logo.",
    heroImageContain: true,
    body: [
      { type: "p", text: "AZAT would like to extend thanks to Waste Management of Arizona for their kind and generous donation to help AZAT offset waste disposal costs when gathering and cleaning up trash from the trail. AZAT fully endorses a “leave no trace” policy when out enjoying the trail. Regardless of who left it behind, we encourage riders to help pick up trash when they see it and help keep the trail pristine." },
    ],
  },
  {
    id: "news-kick-off-meeting-with-logan-simpson",
    title: "Kick-off Meeting with Logan-Simpson",
    slug: "kick-off-meeting-with-logan-simpson",
    publishedAt: "2023-07-17T12:00:00Z",
    category: "Trail Updates",
    excerpt: "AZAT officially begins work on the trail's Master Plan alongside engineering firm Logan-Simpson.",
    heroImage: "/news/logan-simpson-kickoff-2023.jpg",
    heroImageAlt: "AZAT President Jerry Smith presents to Logan-Simpson project partners in a conference room beside the Arizona Alpine Trail flag.",
    body: [
      { type: "p", text: "Today we officially began working on the AZAT Master Plan with our engineering firm Logan-Simpson. Up until now we have completed many tasks in preparation for this, but now we are officially working on items to create the master plan for the project." },
    ],
  },
  {
    id: "news-a-word-from-our-president",
    title: "A Word From Our President",
    slug: "a-word-from-our-president",
    publishedAt: "2023-06-23T12:00:00Z",
    category: "Trail Updates",
    excerpt:
      "AZAT's Master Plan grant has been approved and funded by Arizona State Parks and Trails, laying the groundwork for a 700–800 mile OHV loop trail.",
    heroImage: "/news/azat-logo-512.png",
    heroImageAlt: "Arizona Alpine Trail logo.",
    heroImageContain: true,
    body: [
      { type: "p", text: "The Arizona Alpine Trail, Inc an Arizona 501 (c)(3) non profit corporation was recently notified that our grant for the Master Plan has been approved and funded by Arizona State Parks and Trails effective June 23, 2023." },
      { type: "p", text: "This grant will be the foundation for the creation of our multi-modal, but primarily off road motorized (OHV) 700-800 mile loop trail between Payson and Hannagan Meadow traversing Gila, Coconino, Navajo, Apache and Greenlee counties. The “trail” will be located on some State & County highways and roads but primarily on trails and forest Roads in the Tonto, Coconino and Apache-Sitgreaves forests, which includes 7 Ranger Districts; Tonto Basin, Payson, Mogollon, Black Mesa, Lakeside, Springerville, & Alpine." },
      { type: "p", text: "New and additional economic benefits will accrue to those rural eastern Arizona counties, and cities, towns & communities that have connector trails to them. The Master Plan will feature and promote those cities, towns and communities. Additional promotional material will be created and special signage will direct the OHV traffic to businesses such as lodging, restaurants, gas, car washes, repair facilities, gift stores, groceries, etc. etc." },
      { type: "p", text: "These counties, cities, towns and communities will benefit from the increased revenue from the tourism traffic generated by the users of the Arizona Alpine Trail." },
      { type: "p", text: "The Master Plan will lay the groundwork for future trail development to improve the outdoor off highway experience of the White Mountains, as well as providing for consistent signage along the routes, maintenance of the trails, and in general all future improvements that requires grants to accomplish." },
      { type: "p", text: "Arizona Alpine Trail, Inc thanks Arizona State Parks and Trails, for their continued advice and cooperation for this grant and all the counties, cities, towns and communities that have supported our grant application." },
      { type: "p", text: "Jerry Smith, President Arizona Alpine Trail, Inc" },
    ],
  },
];

const newsPostDocs = [];
for (const post of newsPostSource) {
  console.log(`Uploading hero image for news post: ${post.slug}...`);
  const heroImage = post.heroImage ? await uploadLocalImage(post.heroImage, post.heroImageAlt) : undefined;

  newsPostDocs.push({
    _id: post.id,
    _type: "newsPost",
    title: post.title,
    slug: slug(post.slug),
    category: post.category,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    heroImage,
    heroImageContain: post.heroImageContain || false,
    body: richTextFromBlocks(post.body),
    source: post.source ? { _type: "object", ...post.source } : undefined,
  });
}

const documents = [
  {
    _id: "siteSettings",
    _type: "siteSettings",
    title: "Arizona Alpine Trail",
    description: "High-country OHV routes, connected mountain towns, rider resources, and stewardship guidance.",
    primaryNavigation: [
      { _type: "cta", label: "Trail", href: "/trail", variant: "text" },
      { _type: "cta", label: "Route 1000", href: "/rustys-route-1000", variant: "text" },
      { _type: "cta", label: "Towns", href: "/towns", variant: "text" },
      { _type: "cta", label: "Resources", href: "/resources", variant: "text" },
      { _type: "cta", label: "News", href: "/news", variant: "text" },
      { _type: "cta", label: "Contact", href: "/contact", variant: "text" },
    ],
  },
  {
    _id: "homePage",
    _type: "homePage",
    title: "Arizona Alpine Trail Home",
    heroTitle: "ARIZONA ALPINE TRAIL",
    heroCopy:
      "Explore high-country OHV routes, mountain towns, and rider-ready resources across Arizona's most scenic alpine corridor.",
    heroImage: image(
      "https://azalpinetrail.org/wp-content/uploads/2021/11/OHV_safety_aboutus.jpg",
      "Side-by-side OHV riders on a forest trail near a mountain creek",
    ),
    primaryCta: { _type: "cta", label: "Explore the Trail", href: "/trail", variant: "primary" },
    secondaryCta: { _type: "cta", label: "Route 1000", href: "/rustys-route-1000", variant: "secondary" },
    mapTitle: "Interactive Trail Map",
    mapCopy:
      "Turn on route families, towns, fuel, lodging, and downloads as the official map data grows from planning files into a living trail guide.",
    mapLayers: [
      { _type: "mapLayer", label: "A Route", active: true },
      { _type: "mapLayer", label: "B Route", active: false },
      { _type: "mapLayer", label: "Towns", active: true },
      { _type: "mapLayer", label: "Fuel", active: true },
      { _type: "mapLayer", label: "Lodging", active: true },
    ],
    downloads: [
      { _type: "labeledItem", label: "Full Trail GPX", value: "GPX", description: "v1 draft" },
      { _type: "labeledItem", label: "Route Overlay KML", value: "KML", description: "v1 draft" },
      { _type: "labeledItem", label: "GIS Shapefile", value: "SHP", description: "planning" },
    ],
    routeImage: image("https://azalpinetrail.org/wp-content/uploads/2021/11/aspens_trail_aboutus.jpg", "Forest trail through bright alpine aspens"),
    routeTitle: "11 Days. One Epic Loop.",
    routeCopy:
      "Rusty's Route 1000 becomes an editable itinerary with day-by-day mileage, service notes, lodging guidance, and town connections.",
    timeline: [
      ["01", "Alpine to Greer", "~100", "Eagar", "Lazy Trout Lodge"],
      ["02", "Greer to Show Low", "~85", "Show Low", "Days Inn"],
      ["03", "Show Low to Heber", "~100", "Show Low", "Sawmill Inn"],
      ["04", "Heber to Pine", "~110", "Pine", "Strawberry Inn"],
      ["05", "Pine to Punkin Center", "~80", "Punkin Center", "Local lodging"],
      ["06", "Punkin Center to Young", "~75", "Young", "Book early"],
      ["07", "Young to Globe", "~90", "Globe", "Service hub"],
      ["08", "Globe to Clifton", "~105", "Clifton", "Mountain stay"],
      ["09", "Clifton to Alpine", "~95", "Alpine", "High country"],
      ["10", "Alpine connectors", "~70", "Alpine", "Base camp"],
      ["11", "Finish loop", "~65", "Eagar", "Celebrate"],
    ].map(([day, title, miles, fuel, lodging]) => ({ _type: "timelineStop", day, title, miles, fuel, lodging })),
    communityTitle: "Stronger Towns. Stronger Trail.",
    communityCopy:
      "The trail experience should make rural businesses easy to find while keeping stewardship, land access, and rider safety visible at every step.",
    communityImage: image("https://azalpinetrail.org/wp-content/uploads/2021/11/alpine_forest_aboutus-2500x1215.jpg", "Arizona alpine forest and mountain road"),
    communityStats: [
      { _type: "labeledItem", label: "Projected annual impact", value: "$38.6M" },
      { _type: "labeledItem", label: "Miles planned", value: "680+" },
      { _type: "labeledItem", label: "Communities connected", value: "23" },
      { _type: "labeledItem", label: "Acres of public land nearby", value: "2.3M+" },
    ],
    safetyTitle: "Ride Responsibly",
    safetyCards: [
      { _type: "iconCard", icon: "shield", title: "OHV Safety", text: "Gear, speed, weather, and preparation guidance built into the planning flow." },
      { _type: "iconCard", icon: "map", title: "Stay on Route", text: "Clear route families, waypoints, seasonal status, and downloadable files." },
      { _type: "iconCard", icon: "trees", title: "Respect the Land", text: "Stewardship messages stay visible near maps, towns, and downloads." },
      { _type: "iconCard", icon: "tools", title: "Plan Services", text: "Fuel, lodging, repairs, and town stops become practical ride planning data." },
    ],
    featuredNewsTitle: "Latest News",
    footerCtaTitle: "Plan the Ride. Protect the Route.",
    footerCtaCopy:
      "A Sanity-backed platform gives AZAT room to grow from launch content into maps, donations, products, memberships, and future rider services.",
  },
  {
    _id: "rustysRoutePage",
    _type: "rustysRoutePage",
    title: "Rusty's Route 1000",
    heroKicker: "Rusty's Route 1000",
    heroTitle: "Eleven days around the high country.",
    heroCopy: "A hotel-based Arizona Alpine Trail itinerary beginning and ending in Alpine.",
    heroImage: image("/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg", "Arizona Alpine Trail high country scenery"),
    facts: [
      labeledItem("11 days", "Hotel itinerary"),
      labeledItem("~1,000 mi", "With town connectors"),
      labeledItem("Start anywhere", "Clockwise or counterclockwise"),
    ],
    downloadCta: { _type: "cta", label: "Download GPX", href: "/downloads/arizona-alpine-trail-gpx", variant: "primary" },
    overviewKicker: "Route overview",
    overviewTitle: "The loop at a glance.",
    overviewCopy: "Town markers show the overnight rhythm; the line shows the AZAT backbone.",
    mapHighlights: [
      trailHighlight("Alpine", "Town", "map-pin", 33.8481, -109.1436),
      trailHighlight("Greer", "Lodging", "lodging", 34.0115, -109.4587),
      trailHighlight("Show Low", "Fuel", "fuel", 34.2499, -110.0438),
      trailHighlight("Heber-Overgaard", "Town", "map-pin", 34.4141, -110.5687),
      trailHighlight("Pine", "Lodging", "lodging", 34.407, -111.4926),
      trailHighlight("Punkin Center", "Lodging", "lodging", 33.8684, -111.3001),
      trailHighlight("Young", "Lodging", "lodging", 34.1017, -110.9637),
      trailHighlight("Hannagan Meadow", "Lodging", "lodging", 33.6426, -109.3223),
    ],
    planningKicker: "Know before you go",
    planningNotes: [
      planningNote("Flexible route", "Start in Alpine, Show Low, Payson, Heber-Overgaard, or another town along the trail."),
      planningNote("Best hubs", "Alpine, Show Low, Payson, and Heber-Overgaard have the strongest mix of fuel, food, lodging, and supplies."),
      planningNote("Limited lodging", "Young, Heber, Punkin Center, and Hannagan Meadow have limited motel options. Book early."),
      planningNote("Mileage note", "The core AZAT is about 700 miles. Rusty's Route adds town connectors, fuel stops, sightseeing, and side roads."),
    ],
    itineraryKicker: "Itinerary",
    itineraryTitle: "Day by day.",
    lodgingNote: "Book lodging early. Young, Heber, Punkin Center, and Hannagan Meadow are limited.",
    itineraryDays: [
      rustysDay("01", "Alpine to Greer", "FR 1122", "~100", "Eagar", "Lazy Trout Lodge"),
      rustysDay("02", "Greer to Show Low", undefined, "~85", "Show Low", "Days Inn"),
      rustysDay("03", "Show Low to Heber-Overgaard", "FR 504", "~100", "Show Low, Heber", "Sawmill Inn"),
      rustysDay("04", "Heber-Overgaard to Pine", undefined, "~110", "Pine", "The Strawberry Inn"),
      rustysDay("05", "Pine to Punkin Center", undefined, "~80", "Tonto Basin", "Punkin Center Lodge"),
      rustysDay("06", "Punkin Center to Young", "FR 288", "~90", "Young", "Pleasant Valley Inn"),
      rustysDay("07", "Young to Heber-Overgaard", "Black Canyon Rd", "~90", "Heber", "Sawmill Inn"),
      rustysDay("08", "Heber-Overgaard to Show Low", undefined, "~90", "Show Low", "Days Inn"),
      rustysDay("09", "Show Low to Greer", "FR 1122", "~85", "Big Lake or Eagar", "Lazy Trout Lodge"),
      rustysDay("10", "Greer to Hannagan Meadow", "FR 576", "~85", "Big Lake", "Hannagan Lodge"),
      rustysDay("11", "Hannagan Meadow to Alpine", undefined, "~85", "Alpine", "Trip ends"),
    ],
    finalCtaKicker: "Ready to ride",
    finalCtaTitle: "Take the route file with you.",
    finalCtaImage: image("/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg", ""),
    seo: {
      _type: "seo",
      title: "Rusty's Route 1000",
      description: "An 11-day hotel-based ride around the Arizona Alpine Trail.",
    },
  },
  {
    _id: "route-rustys-route-1000",
    _type: "route",
    title: "Rusty's Route 1000",
    slug: slug("rustys-route-1000"),
    description: "An 11-day, hotel-based OHV loop through Arizona high country.",
    routeFamily: "Rusty's Route 1000",
    stats: { _type: "routeStats", mileage: 1000, days: 11, surface: "OHV trail and forest roads", season: "Late spring through fall" },
  },
  ...[
    ["town-alpine", "Alpine", "alpine", "The high-country anchor for AZAT and Rusty's Route 1000.", ["Trail Access", "Fuel", "Food", "Lodging"]],
    ["town-greer", "Greer", "greer", "A mountain stop with lodging inventory that should be booked early.", ["Lodging", "Food", "Scenic"]],
    ["town-show-low", "Show Low", "show-low", "A larger services hub for riders crossing the White Mountains.", ["Fuel", "Repairs", "Groceries"]],
    ["town-pine", "Pine", "pine", "A community gateway that connects trail tourism to local businesses.", ["Fuel", "Food", "Lodging"]],
  ].map(([id, title, current, description, services]) => ({
    _id: id,
    _type: "town",
    title,
    slug: slug(current),
    description,
    services,
  })),
  ...segmentDocs,
  ...[
    ["download-full-trail-gpx", "Full Trail GPX", "full-trail-gpx", "GPX"],
    ["download-route-overlay-kml", "Route Overlay KML", "route-overlay-kml", "KML"],
    ["download-gis-shapefile", "GIS Shapefile", "gis-shapefile", "SHP"],
  ].map(([id, title, current, fileType]) => ({
    _id: id,
    _type: "downloadFile",
    title,
    slug: slug(current),
    fileType,
    version: "v1 draft",
    notes: "Starter placeholder. Replace with official file upload before launch.",
  })),
  ...segmentDownloadDocs,
  ...newsPostDocs,
  {
    _id: "faq-route-files",
    _type: "faq",
    question: "Where can riders download route files?",
    category: "Downloads",
  },
  {
    _id: "resource-ohv-safety",
    _type: "resource",
    title: "OHV Safety",
    slug: slug("ohv-safety"),
    description: "Starter safety resource for riders planning an AZAT trip.",
    url: "https://azalpinetrail.org",
  },
  {
    _id: "product-trail-merch-placeholder",
    _type: "product",
    title: "Trail Merch Placeholder",
    slug: slug("trail-merch-placeholder"),
    description: "Starter product content. Stripe checkout is planned for a future phase.",
    active: false,
  },
  {
    _id: "donation-campaign-trail-stewardship",
    _type: "donationCampaign",
    title: "Trail Stewardship Fund",
    slug: slug("trail-stewardship-fund"),
    description: "Starter donation campaign content. Stripe checkout is planned for a future phase.",
    suggestedAmounts: [25, 50, 100, 250],
    active: false,
  },
  ...[
    ["/the-trail", "/trail"],
    ["/about-us", "/about"],
    ["/frequently-asked-questions", "/faq"],
    ["/contact-us", "/contact"],
    ["/privacy-policy", "/privacy"],
  ].map(([source, destination]) => ({
    _id: `redirect-${source.replaceAll("/", "-").replace(/^-/, "")}`,
    _type: "redirect",
    source,
    destination,
    permanent: true,
  })),
];

const transaction = client.transaction();
for (const doc of documents) {
  transaction.createOrReplace(doc);
}

await transaction.commit();

console.log(`Seeded ${documents.length} Sanity documents into ${projectId}/${dataset}.`);
