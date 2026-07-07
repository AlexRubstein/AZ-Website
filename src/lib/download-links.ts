const gatedDownloadLinks: Record<string, string> = {
  "/azat/downloads/arizona-alpine-trail.gpx": "/downloads/arizona-alpine-trail-gpx",
  "/azat/downloads/azat-segments-v5.kml": "/downloads/azat-segments-v5-kml",
  "/azat/downloads/azat-shapefile.zip": "/downloads/azat-shapefile",
};

export function resolveDownloadHref(href?: string, fallback = "/resources") {
  if (!href) {
    return fallback;
  }

  return gatedDownloadLinks[href] ?? href;
}
