import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";

const sourceGpxPath = resolve("protected-download-seed/current/arizona-alpine-trail.gpx");
const segmentIndexPath = resolve("content/trail-segment-index.json");
const outputDir = resolve("protected-download-seed/segments");
const sqlOutputPath = resolve("protected-download-seed/segment-download-files.sql");

const version = "V5 / Mar 21, 2026";
const publishedAt = "2026-03-21";
const contentType = "application/gpx+xml";

const gpx = readFileSync(sourceGpxPath, "utf8");
const segmentIndex = JSON.parse(readFileSync(segmentIndexPath, "utf8"));

function textFrom(xml, tag) {
  return xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`))?.[1]?.trim() || "";
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function escapeSql(value) {
  return String(value).replaceAll("'", "''");
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .replace(/\bazat\b/g, "")
    .replace(/\d+/g, "")
    .replace(/canero/g, "carnero")
    .replace(/borderline/g, "border line")
    .replace(/[^a-z]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function trackIdFromName(name) {
  const match = name.match(/AZAT\s*0?(\d+)/i);
  return match ? Number(match[1]) : null;
}

function parseBlocks(tag) {
  return [...gpx.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, "g"))].map((match) => match[0]);
}

function boundsFor(trackXml) {
  const points = [...trackXml.matchAll(/<trkpt lat="([^"]+)" lon="([^"]+)"/g)].map((match) => ({
    lat: Number(match[1]),
    lon: Number(match[2]),
  }));

  if (!points.length) {
    throw new Error(`Track has no points: ${textFrom(trackXml, "name")}`);
  }

  return points.reduce(
    (acc, point) => ({
      minlat: Math.min(acc.minlat, point.lat),
      minlon: Math.min(acc.minlon, point.lon),
      maxlat: Math.max(acc.maxlat, point.lat),
      maxlon: Math.max(acc.maxlon, point.lon),
    }),
    {
      minlat: Number.POSITIVE_INFINITY,
      minlon: Number.POSITIVE_INFINITY,
      maxlat: Number.NEGATIVE_INFINITY,
      maxlon: Number.NEGATIVE_INFINITY,
    },
  );
}

function formatBounds(bounds) {
  return `<bounds minlat="${bounds.minlat.toFixed(8)}" minlon="${bounds.minlon.toFixed(8)}" maxlat="${bounds.maxlat.toFixed(8)}" maxlon="${bounds.maxlon.toFixed(8)}"/>`;
}

function headerFor(segment, bounds) {
  const sourceName = basename(sourceGpxPath);
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Arizona Alpine Trail segment export" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v2" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 https://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata>
<name>${escapeXml(`AZAT Segment ${String(segment.number).padStart(2, "0")} - ${segment.name}`)}</name>
<desc>${escapeXml(`Generated from ${sourceName}.`)}</desc>
${formatBounds(bounds)}
</metadata>
`;
}

const waypointBlocks = parseBlocks("wpt");
const trackBlocks = parseBlocks("trk");
const tracksByNumber = new Map();
const tracksByName = new Map();

for (const trackXml of trackBlocks) {
  const name = textFrom(trackXml, "name");
  const number = trackIdFromName(name);
  if (number != null) tracksByNumber.set(number, trackXml);
  tracksByName.set(normalize(name), trackXml);
}

mkdirSync(outputDir, { recursive: true });

const rows = [];
const missing = [];

for (const segment of segmentIndex) {
  const trackXml = tracksByNumber.get(segment.number) ?? tracksByName.get(normalize(segment.name));

  if (!trackXml) {
    missing.push(`${segment.number}: ${segment.name}`);
    continue;
  }

  const waypointMatches = waypointBlocks.filter((waypointXml) => {
    const label = textFrom(waypointXml, "label_text") || textFrom(waypointXml, "name");
    return normalize(label) === normalize(segment.name);
  });

  const bounds = boundsFor(trackXml);
  const filename = `${String(segment.number).padStart(2, "0")}-${segment.slug}.gpx`;
  const storagePath = `segments/${filename}`;
  const slug = `${segment.slug}-gpx`;
  const title = `${String(segment.number).padStart(2, "0")} ${segment.name} GPX`;
  const fileContent = `${headerFor(segment, bounds)}${waypointMatches.join("\n")}${waypointMatches.length ? "\n" : ""}${trackXml}\n</gpx>\n`;

  writeFileSync(resolve(outputDir, filename), fileContent);

  rows.push({
    slug,
    title,
    fileType: "GPX",
    version,
    storagePath,
    filename,
    contentType,
    active: true,
    publishedAt,
    notes: `Individual GPX for Arizona Alpine Trail Segment ${String(segment.number).padStart(2, "0")} - ${segment.name}.`,
  });
}

if (missing.length) {
  throw new Error(`Missing GPX tracks for: ${missing.join(", ")}`);
}

const values = rows
  .map(
    (row) => `  (
    '${escapeSql(row.slug)}',
    '${escapeSql(row.title)}',
    '${escapeSql(row.fileType)}',
    '${escapeSql(row.version)}',
    '${escapeSql(row.storagePath)}',
    '${escapeSql(row.filename)}',
    '${escapeSql(row.contentType)}',
    ${row.active ? "true" : "false"},
    '${escapeSql(row.publishedAt)}',
    '${escapeSql(row.notes)}'
  )`,
  )
  .join(",\n");

const sql = `insert into public.download_files (
  slug,
  title,
  file_type,
  version,
  storage_path,
  filename,
  content_type,
  active,
  published_at,
  notes
)
values
${values}
on conflict (slug) do update set
  title = excluded.title,
  file_type = excluded.file_type,
  version = excluded.version,
  storage_path = excluded.storage_path,
  filename = excluded.filename,
  content_type = excluded.content_type,
  active = excluded.active,
  published_at = excluded.published_at,
  notes = excluded.notes,
  updated_at = now();
`;

writeFileSync(sqlOutputPath, sql);

console.log(`Generated ${rows.length} segment GPX files in ${outputDir}`);
console.log(`Generated download metadata SQL at ${sqlOutputPath}`);
