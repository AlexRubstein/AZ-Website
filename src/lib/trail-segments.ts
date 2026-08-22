import { sanityClient } from "@/sanity/lib/client";
import { trailSegmentListQuery, trailSegmentQuery } from "@/sanity/lib/queries";
import { routeSegmentSummaries } from "@/lib/route-preview-data";

// The trail's own numbering, 1-30 with 19 and 22 permanently unassigned (28 real segments).
// Names and GPX track ids are authoritative from protected-download-seed/current/arizona-alpine-trail.gpx.
// Only segments with a real Sanity `trailSegment` document get a page — see `getTrailHubSegments`.
export const trailSegmentIndex: { number: number; name: string; gpxId: string; slug: string }[] = [
  { number: 1, name: "Rye Creek", gpxId: "azat01-rye-creek", slug: "rye-creek" },
  { number: 2, name: "Tonto Basin", gpxId: "azat02-tonto-basin", slug: "tonto-basin" },
  { number: 3, name: "Juniper Canyon", gpxId: "azat03-juniper-canyon", slug: "juniper-canyon" },
  { number: 4, name: "Cherry Creek", gpxId: "azat04-cherry-creek", slug: "cherry-creek" },
  { number: 5, name: "Canyon Point", gpxId: "azat05-canyon-point", slug: "canyon-point" },
  { number: 6, name: "Legacy Ranch", gpxId: "azat06-legacy-ranch", slug: "legacy-ranch" },
  { number: 7, name: "Deer Springs Lookout", gpxId: "azat07-deer-springs-lookout", slug: "deer-springs-lookout" },
  { number: 8, name: "Border Line", gpxId: "azat08-border-line", slug: "border-line" },
  { number: 9, name: "Porter Mountain", gpxId: "azat09-porter-mountain", slug: "porter-mountain" },
  { number: 10, name: "Greens Peak", gpxId: "azat10-greens-peak", slug: "greens-peak" },
  { number: 11, name: "Little Colorado River", gpxId: "azat11-little-colorado-river", slug: "little-colorado-river" },
  { number: 12, name: "Black River", gpxId: "azat12-black-river", slug: "black-river" },
  { number: 13, name: "Hannagan", gpxId: "azat13-hannagan", slug: "hannagan" },
  { number: 14, name: "Balke Cabin", gpxId: "azat14-balke-cabin", slug: "balke-cabin" },
  { number: 15, name: "Johns Canyon", gpxId: "azat15-johns-canyon", slug: "johns-canyon" },
  { number: 16, name: "Mamie Creek", gpxId: "azat16-mamie-creek", slug: "mamie-creek" },
  { number: 17, name: "Milligan Valley", gpxId: "azat17-milligan-valley", slug: "milligan-valley" },
  { number: 18, name: "South Fork", gpxId: "azat18-south-fork", slug: "south-fork" },
  { number: 20, name: "Canero Lake", gpxId: "azat20-canero-lake", slug: "canero-lake" },
  { number: 21, name: "Land of the Pioneers", gpxId: "azat21-land-of-the-pioneers", slug: "land-of-the-pioneers" },
  { number: 23, name: "Lone Pine Dam", gpxId: "azat23-lone-pine-dam", slug: "lone-pine-dam" },
  { number: 24, name: "Maverick West", gpxId: "azat24-maverick-west", slug: "maverick-west" },
  { number: 25, name: "Many Draws", gpxId: "azat25-many-draws", slug: "many-draws" },
  { number: 26, name: "Chevelon Crossing", gpxId: "azat26-chevelon-crossing", slug: "chevelon-crossing" },
  { number: 27, name: "Canyon Lands", gpxId: "azat27-canyon-lands", slug: "canyon-lands" },
  { number: 28, name: "View After View", gpxId: "azat28-view-after-view", slug: "view-after-view" },
  { number: 29, name: "The Rim", gpxId: "azat29-the-rim", slug: "the-rim" },
  { number: 30, name: "Doll Baby", gpxId: "azat30-doll-baby", slug: "doll-baby" },
];

export type TrailHubSegment = {
  number: number;
  name: string;
  gpxId: string;
  slug: string;
  distanceMiles: number | null;
  minElevationFeet: number | null;
  maxElevationFeet: number | null;
  trailRating: string | null;
  published: boolean;
};

export async function getTrailHubSegments(): Promise<TrailHubSegment[]> {
  // A slug counts as published if it has a real Sanity document OR a code-level fallback
  // (see `publishedSlugs` below) — the segment detail page renders from the fallback either
  // way, so the hub must agree, or it would hide a page that actually works.
  const knownPublished = new Set(publishedSlugs);

  // Seed ratings from the code-level fallbacks (e.g. Rye Creek) so the filter works even
  // before a matching Sanity document exists; a real Sanity value overrides it below.
  const ratingsBySlug = new Map<string, string>();
  Object.values(fallbacksBySlug).forEach((data) => {
    if (data.slug?.current && data.trailRating) ratingsBySlug.set(data.slug.current, data.trailRating);
  });

  try {
    const docs = await sanityClient.fetch<{ slug?: { current?: string }; trailRating?: string }[]>(
      trailSegmentListQuery,
      {},
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );
    docs.forEach((doc) => {
      if (doc.slug?.current) {
        knownPublished.add(doc.slug.current);
        if (doc.trailRating) ratingsBySlug.set(doc.slug.current, doc.trailRating);
      }
    });
  } catch {
    // Sanity unreachable — the code-level fallbacks above still stand.
  }

  return trailSegmentIndex.map((entry) => {
    const summary = routeSegmentSummaries.find((item) => item.id === entry.gpxId);
    return {
      number: entry.number,
      name: entry.name,
      gpxId: entry.gpxId,
      slug: entry.slug,
      distanceMiles: summary?.distanceMiles ?? null,
      minElevationFeet: summary?.minElevationFeet ?? null,
      maxElevationFeet: summary?.maxElevationFeet ?? null,
      trailRating: ratingsBySlug.get(entry.slug) ?? null,
      published: knownPublished.has(entry.slug),
    };
  });
}

export type TrailSegmentDownload = {
  title?: string;
  slug?: { current?: string };
  fileType?: string;
  version?: string;
  publishedAt?: string;
  externalUrl?: string;
  notes?: string;
};

export type TrailSegmentGalleryImage = {
  url?: string;
  alt?: string;
};

export type TrailSegmentPageData = {
  title: string;
  slug?: { current: string };
  segmentCode?: string;
  segmentNumber: number;
  status?: string;
  lengthMiles?: number;
  minElevationFeet?: number;
  maxElevationFeet?: number;
  elevationGainFeet?: number;
  elevationLossFeet?: number;
  trailRating?: string;
  startTown?: { title?: string; slug?: { current?: string } };
  endTown?: { title?: string; slug?: { current?: string } };
  downloads?: TrailSegmentDownload[];
  heroImage?: string;
  heroImageAlt?: string;
  mapImage?: string;
  mapImageAlt?: string;
  descriptionBody?: unknown;
  amenities?: string[];
  amenitiesNote?: string;
  safetyNote?: string;
  pointsOfInterest?: string[];
  gallery?: TrailSegmentGalleryImage[];
  lastVerifiedAt?: string;
  seo?: {
    title?: string;
    description?: string;
  };
};

export const fallbackRyeCreekSegment: TrailSegmentPageData = {
  title: "Rye Creek",
  slug: { current: "rye-creek" },
  segmentCode: "01",
  segmentNumber: 1,
  status: "Open",
  lengthMiles: 25.4,
  minElevationFeet: 2761,
  maxElevationFeet: 5007,
  elevationGainFeet: 3357,
  elevationLossFeet: 5239,
  trailRating: "more-difficult-blue",
  downloads: [
    {
      title: "Rye Creek GPX",
      slug: { current: "rye-creek-gpx" },
      fileType: "GPX",
      notes: "Falls back to the full-trail GPX until the Rye Creek-only extract is uploaded to Supabase Storage.",
    },
  ],
  heroImage: "/azat/segments/rye-creek/hero.jpg",
  heroImageAlt: "Prickly pear cactus overlooking the Rye Creek foothills and mountains",
  mapImage: "/azat/segments/rye-creek/map.png",
  mapImageAlt: "AZAT Rye Creek route map with ranger district boundaries and land ownership legend",
  descriptionBody:
    "The Rye Creek segment extends between Payson and Jakes Corner in Gila County from the junction of FR 406 (West Doll Baby Road) and FR 511 to the junction of FR 184 and SR 188. The alignment threads the Tonto National Forest, crossing the Rye Creek drainage and working past local landmarks, including Wonder Gulch, Willow Spring Canyon, Weymouth Flat, Sorghum Hill, Bishop Knoll, Haycox Mountain, Black Mountain, and Bee Canyon, with wide views of rolling foothills and piñon juniper/ponderosa country.\n\nThis segment consists primarily of a gravel and rocky dirt two-track, with embedded rock, small boulders and ledges, washboards, and a few steeper grades; it crosses SR 87. A high-clearance 4WD/OHV is recommended due to rock steps, erosion cuts, and potential washouts after storms.",
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
    { url: "/azat/segments/rye-creek/gallery-01-creek-drainage.jpg", alt: "Aerial view of the Rye Creek drainage and cottonwoods" },
    { url: "/azat/segments/rye-creek/gallery-02-mountain-clouds.jpg", alt: "Dirt two-track switchback with distant mountain peak" },
    { url: "/azat/segments/rye-creek/gallery-03-switchback-aerial.jpg", alt: "Aerial view of a river crossing along the route" },
    { url: "/azat/segments/rye-creek/gallery-04-dirt-road-clouds.jpg", alt: "Dirt road winding through juniper under a cloudy sky" },
    { url: "/azat/segments/rye-creek/gallery-05-winding-roads.jpg", alt: "Aerial view of winding dirt roads through desert terrain" },
    { url: "/azat/segments/rye-creek/gallery-06-ranger-truckbed.jpg", alt: "UTV loaded with gear parked on the trail" },
    { url: "/azat/segments/rye-creek/gallery-07-valley-view.jpg", alt: "Overlook of the Rye Creek valley and surrounding mountains" },
  ],
  lastVerifiedAt: "2026-08-22",
  seo: {
    title: "Rye Creek — Arizona Alpine Trail Segment 01",
    description: "25.4 miles between Payson and Jakes Corner. More Difficult/Blue rated, high-clearance 4WD/OHV recommended.",
  },
};

function mergeTrailSegmentPage(data: TrailSegmentPageData | null, fallback: TrailSegmentPageData): TrailSegmentPageData {
  if (!data?.title) return fallback;

  return {
    ...fallback,
    ...data,
    downloads: data.downloads?.length ? data.downloads : fallback.downloads,
    heroImage: data.heroImage || fallback.heroImage,
    heroImageAlt: data.heroImageAlt || fallback.heroImageAlt,
    mapImage: data.mapImage || fallback.mapImage,
    mapImageAlt: data.mapImageAlt || fallback.mapImageAlt,
    amenities: data.amenities?.length ? data.amenities : fallback.amenities,
    pointsOfInterest: data.pointsOfInterest?.length ? data.pointsOfInterest : fallback.pointsOfInterest,
    gallery: data.gallery?.length ? data.gallery : fallback.gallery,
  };
}

const fallbacksBySlug: Record<string, TrailSegmentPageData> = {
  "rye-creek": fallbackRyeCreekSegment,
};

export const publishedSlugs = Object.keys(fallbacksBySlug);

export type TrailSegmentNeighbor = { name: string; slug: string; published: boolean } | null;

export function getTrailSegmentNeighbors(segmentNumber: number): { prev: TrailSegmentNeighbor; next: TrailSegmentNeighbor } {
  const sorted = [...trailSegmentIndex].sort((a, b) => a.number - b.number);
  const index = sorted.findIndex((entry) => entry.number === segmentNumber);
  const toNeighbor = (entry: (typeof trailSegmentIndex)[number] | undefined): TrailSegmentNeighbor =>
    entry ? { name: entry.name, slug: entry.slug, published: publishedSlugs.includes(entry.slug) } : null;

  return {
    prev: index > 0 ? toNeighbor(sorted[index - 1]) : null,
    next: index >= 0 && index < sorted.length - 1 ? toNeighbor(sorted[index + 1]) : null,
  };
}

export async function getTrailSegmentPageData(slug: string): Promise<TrailSegmentPageData | null> {
  const fallback = fallbacksBySlug[slug];

  try {
    const data = await sanityClient.fetch<TrailSegmentPageData | null>(
      trailSegmentQuery,
      { slug },
      process.env.NODE_ENV === "development" ? { cache: "no-store" } : { next: { revalidate: 30 } },
    );

    if (data) return fallback ? mergeTrailSegmentPage(data, fallback) : data;
    return fallback ?? null;
  } catch {
    return fallback ?? null;
  }
}
