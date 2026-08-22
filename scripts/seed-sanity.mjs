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
  {
    _id: "trail-segment-rye-creek",
    _type: "trailSegment",
    title: "Rye Creek",
    slug: slug("rye-creek"),
    segmentCode: "01",
    segmentNumber: 1,
    status: "Open",
    lengthMiles: 25.4,
    minElevationFeet: 2761,
    maxElevationFeet: 5007,
    elevationGainFeet: 3357,
    elevationLossFeet: 5239,
    trailRating: "more-difficult-blue",
    downloads: [{ _type: "reference", _ref: "download-rye-creek-gpx" }],
    heroImage: image("/azat/segments/rye-creek/hero.jpg", "Prickly pear cactus overlooking the Rye Creek foothills and mountains"),
    mapImage: image("/azat/segments/rye-creek/map.png", "AZAT Rye Creek route map with ranger district boundaries and land ownership legend"),
    descriptionBody: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The Rye Creek segment extends between Payson and Jakes Corner in Gila County from the junction of FR 406 (West Doll Baby Road) and FR 511 to the junction of FR 184 and SR 188. The alignment threads the Tonto National Forest, crossing the Rye Creek drainage and working past local landmarks, including Wonder Gulch, Willow Spring Canyon, Weymouth Flat, Sorghum Hill, Bishop Knoll, Haycox Mountain, Black Mountain, and Bee Canyon, with wide views of rolling foothills and piñon juniper/ponderosa country.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This segment consists primarily of a gravel and rocky dirt two-track, with embedded rock, small boulders and ledges, washboards, and a few steeper grades; it crosses SR 87. A high-clearance 4WD/OHV is recommended due to rock steps, erosion cuts, and potential washouts after storms.",
          },
        ],
      },
    ],
    amenities: ["Food", "Fuel", "Lodging", "Repair"],
    amenitiesNote:
      "Full services (fuel, food, lodging, supplies, OHV repair) are available in Payson. Jakes Corner offers limited services (e.g., bar & grill, RV options), and Gisela provides limited lodging via vacation rentals with access to nearby hiking, camping, and Tonto Creek recreation.",
    safetyNote:
      "Lower-elevation desert conditions can bring extreme heat in summer and monsoon-driven flash flooding in washes. Dust, loose rock, and open range livestock are common. Use extra caution at the SR 87 crossing, and carry ample water, recovery gear, and reliable navigation.",
    pointsOfInterest: [
      "Gisela Ruins",
      "Jim Jones Shooting Range",
      "Hellsgate Wilderness Area",
      "Tonto Creek",
      "Jake's Corner Ruins",
      "Roosevelt Lake",
      "Mazatzal Peak (7,910 ft) views",
    ],
    gallery: [
      image("/azat/segments/rye-creek/gallery-01-creek-drainage.jpg", "Aerial view of the Rye Creek drainage and cottonwoods"),
      image("/azat/segments/rye-creek/gallery-02-mountain-clouds.jpg", "Dirt two-track switchback with distant mountain peak"),
      image("/azat/segments/rye-creek/gallery-03-switchback-aerial.jpg", "Aerial view of a river crossing along the route"),
      image("/azat/segments/rye-creek/gallery-04-dirt-road-clouds.jpg", "Dirt road winding through juniper under a cloudy sky"),
      image("/azat/segments/rye-creek/gallery-05-winding-roads.jpg", "Aerial view of winding dirt roads through desert terrain"),
      image("/azat/segments/rye-creek/gallery-06-ranger-truckbed.jpg", "UTV loaded with gear parked on the trail"),
      image("/azat/segments/rye-creek/gallery-07-valley-view.jpg", "Overlook of the Rye Creek valley and surrounding mountains"),
    ],
    lastVerifiedAt: "2026-08-22",
    seo: {
      _type: "seo",
      title: "Rye Creek — Arizona Alpine Trail Segment 01",
      description: "25.4 miles between Payson and Jakes Corner. More Difficult/Blue rated, high-clearance 4WD/OHV recommended.",
    },
  },
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
  {
    _id: "download-rye-creek-gpx",
    _type: "downloadFile",
    title: "Rye Creek GPX",
    slug: slug("rye-creek-gpx"),
    fileType: "GPX",
    version: "v1",
    notes:
      "Segment-specific extract, generated from the AZAT01-Rye Creek track. Pending upload to Supabase Storage — see docs/protected-downloads.md for the admin upload workflow.",
  },
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
