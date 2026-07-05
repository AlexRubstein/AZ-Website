import { createClient } from "@sanity/client";

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
const slug = (current) => ({ _type: "slug", current });

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
    featuredNews: [
      {
        _type: "featuredNewsCard",
        title: "AZ Game & Fish Outdoor Expo",
        slug: "az-game-fish-outdoor-expo",
        date: "2025-03-28",
        excerpt: "AZAT shares the trail project with riders, families, and agency partners.",
        image: image("https://azalpinetrail.org/wp-content/uploads/2026/06/731588927_1314291207585598_618352519641471366_n.jpg", "Sunset over an Arizona alpine ranch fence"),
      },
      {
        _type: "featuredNewsCard",
        title: "AZAT Goals and Objectives Workshop",
        slug: "azat-goals-and-objectives-workshop",
        date: "2024-01-12",
        excerpt: "Community input helps align the trail system with town and county goals.",
        image: image("https://azalpinetrail.org/wp-content/uploads/2021/11/alpine_forest_aboutus-2500x1215.jpg", "High-country forest landscape in Arizona"),
      },
    ],
    footerCtaTitle: "Plan the Ride. Protect the Route.",
    footerCtaCopy:
      "A Sanity-backed platform gives AZAT room to grow from launch content into maps, donations, products, memberships, and future rider services.",
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
  ...[
    ["trail-segment-a-route", "A Route", "a-route", "A", "Primary loop planning route with town connectors and downloadable files."],
    ["trail-segment-b-route", "B Route", "b-route", "B", "Alternate trail family for future official and seasonal segment detail."],
  ].map(([id, title, current, segmentCode, description]) => ({
    _id: id,
    _type: "trailSegment",
    title,
    slug: slug(current),
    segmentCode,
    routeFamily: title,
    status: "Preliminary",
    description,
  })),
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
  ...[
    ["news-az-game-fish-outdoor-expo", "AZ Game & Fish Outdoor Expo", "az-game-fish-outdoor-expo", "AZAT shares the trail project with riders, families, and agency partners.", "2025-03-28T12:00:00Z"],
    ["news-azat-goals-and-objectives-workshop", "AZAT Goals and Objectives Workshop", "azat-goals-and-objectives-workshop", "Community input helps align the trail system with town and county goals.", "2024-01-12T12:00:00Z"],
    ["news-alpine-open-house-meeting", "Alpine Open House Meeting", "alpine-open-house-meeting", "Feedback from Alpine residents shaped master-plan conversations.", "2023-08-30T12:00:00Z"],
  ].map(([id, title, current, excerpt, publishedAt]) => ({
    _id: id,
    _type: "newsPost",
    title,
    slug: slug(current),
    excerpt,
    publishedAt,
  })),
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
