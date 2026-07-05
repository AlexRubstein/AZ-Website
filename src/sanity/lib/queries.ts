import { groq } from "next-sanity";

export const homeQuery = groq`*[_type == "siteSettings"][0]{
  title,
  description,
  primaryNavigation,
  footerNavigation,
  featuredRoute->,
  featuredDownloads[]->
}`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  title,
  heroTitle,
  heroCopy,
  "heroImage": coalesce(heroImage.externalUrl, heroImage.image.asset->url),
  "heroImageAlt": heroImage.alt,
  primaryCta,
  secondaryCta,
  missionStatement,
  missionAttribution,
  "missionImage": coalesce(missionImage.externalUrl, missionImage.image.asset->url),
  "missionImageAlt": missionImage.alt,
  mapTitle,
  mapCopy,
  mapLayers,
  trailHighlights[]{
    _key,
    title,
    category,
    note,
    icon,
    coordinates,
    facts,
    "image": coalesce(image.externalUrl, image.image.asset->url),
    "imageAlt": image.alt,
    town->{title, slug},
    route->{title, slug}
  },
  downloads,
  itineraryTitle,
  "itineraryImage": coalesce(itineraryImage.externalUrl, itineraryImage.image.asset->url),
  "itineraryImageAlt": itineraryImage.alt,
  itineraryHref,
  itineraryCards[]{
    _key,
    title,
    label,
    href,
    miles,
    days,
    status,
    "image": coalesce(image.externalUrl, image.image.asset->url),
    "imageAlt": image.alt
  },
  "routeImage": coalesce(routeImage.externalUrl, routeImage.image.asset->url),
  "routeImageAlt": routeImage.alt,
  routeTitle,
  routeCopy,
  timeline,
  rideChapters[]{
    type,
    eyebrow,
    title,
    text,
    "image": coalesce(image.externalUrl, image.image.asset->url),
    "imageAlt": image.alt,
    cta
  },
  storyBlocks[]{
    eyebrow,
    title,
    text,
    "image": coalesce(image.externalUrl, image.image.asset->url),
    "imageAlt": image.alt,
    cta
  },
  resourceLinks,
  communityTitle,
  communityCopy,
  "communityImage": coalesce(communityImage.externalUrl, communityImage.image.asset->url),
  "communityImageAlt": communityImage.alt,
  communityStats,
  safetyTitle,
  safetyCards,
  featuredNewsTitle,
  featuredNews[]{
    title,
    slug,
    date,
    excerpt,
    "image": coalesce(image.externalUrl, image.image.asset->url),
    "imageAlt": image.alt
  },
  footerCtaTitle,
  footerCtaCopy,
  seo
}`;

export const newsPostQuery = groq`*[_type == "newsPost" && slug.current == $slug][0]{
  title,
  slug,
  excerpt,
  publishedAt,
  heroImage,
  body
}`;

export const townQuery = groq`*[_type == "town" && slug.current == $slug][0]{
  title,
  slug,
  description,
  heroImage,
  coordinates,
  services,
  body
}`;

export const trailSegmentQuery = groq`*[_type == "trailSegment" && slug.current == $slug][0]{
  title,
  slug,
  routeFamily,
  segmentCode,
  status,
  mileage,
  difficulty,
  startTown->,
  endTown->,
  downloads[]->,
  waypoints[]->,
  body
}`;
