import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const envPath = resolve(".env.local");
const bucketName = "protected-downloads";
const version = "V5 / Mar 21, 2026";
const publishedAt = "2026-03-21";
const segmentDir = resolve("protected-download-seed/segments");
const segmentIndexPath = resolve("content/trail-segment-index.json");

function loadEnvFile(path) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...parts] = trimmed.split("=");
    const rawValue = parts.join("=").trim();
    process.env[key.trim()] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function fileBuffer(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing file: ${path}`);
  }
  return readFileSync(path);
}

function fullDownloadRows() {
  return [
    {
      slug: "arizona-alpine-trail-gpx",
      title: "Complete Trail GPX",
      file_type: "GPX",
      version,
      storage_path: "current/arizona-alpine-trail.gpx",
      filename: "arizona-alpine-trail.gpx",
      content_type: "application/gpx+xml",
      active: true,
      published_at: publishedAt,
      notes: null,
    },
    {
      slug: "azat-segments-v5-kml",
      title: "Segment Overlay KML",
      file_type: "KML",
      version,
      storage_path: "current/azat-segments-v5.kml",
      filename: "azat-segments-v5.kml",
      content_type: "application/vnd.google-earth.kml+xml",
      active: true,
      published_at: publishedAt,
      notes: null,
    },
    {
      slug: "azat-shapefile",
      title: "GIS Shapefile",
      file_type: "SHP",
      version: "Planning archive",
      storage_path: "current/azat-shapefile.zip",
      filename: "azat-shapefile.zip",
      content_type: "application/zip",
      active: true,
      published_at: null,
      notes: null,
    },
  ];
}

function segmentDownloadRows() {
  const index = JSON.parse(readFileSync(segmentIndexPath, "utf8"));
  return index.map((segment) => {
    const filename = `${String(segment.number).padStart(2, "0")}-${segment.slug}.gpx`;
    return {
      slug: `${segment.slug}-gpx`,
      title: `${String(segment.number).padStart(2, "0")} ${segment.name} GPX`,
      file_type: "GPX",
      version,
      storage_path: `segments/${filename}`,
      filename,
      content_type: "application/gpx+xml",
      active: true,
      published_at: publishedAt,
      notes: `Individual GPX for Arizona Alpine Trail Segment ${String(segment.number).padStart(2, "0")} - ${segment.name}.`,
    };
  });
}

async function ensureBucket(supabase) {
  const { error } = await supabase.storage.createBucket(bucketName, { public: false });

  if (error && !/already exists/i.test(error.message)) {
    throw error;
  }
}

async function uploadFile(supabase, row, localPath) {
  const { error } = await supabase.storage.from(bucketName).upload(row.storage_path, fileBuffer(localPath), {
    cacheControl: "0",
    contentType: row.content_type,
    upsert: true,
  });

  if (error) {
    throw new Error(`${row.storage_path}: ${error.message}`);
  }
}

loadEnvFile(envPath);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local or the shell.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const anonSupabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

await ensureBucket(supabase);

const rows = [...fullDownloadRows(), ...segmentDownloadRows()];
const { error: upsertError } = await supabase.from("download_files").upsert(rows, { onConflict: "slug" });

if (upsertError) {
  throw upsertError;
}

for (const row of fullDownloadRows()) {
  await uploadFile(supabase, row, resolve("protected-download-seed", row.storage_path));
}

const segmentFiles = readdirSync(segmentDir).filter((file) => file.endsWith(".gpx")).sort();
for (const file of segmentFiles) {
  const row = rows.find((download) => download.storage_path === `segments/${file}`);
  if (!row) {
    throw new Error(`No download_files row found for ${file}`);
  }
  await uploadFile(supabase, row, resolve(segmentDir, file));
}

const { data, error: verifyError } = await supabase
  .from("download_files")
  .select("slug, storage_path")
  .in("slug", rows.map((row) => row.slug))
  .order("slug", { ascending: true });

if (verifyError) {
  throw verifyError;
}

const { data: publicData, error: publicVerifyError } = await anonSupabase
  .from("download_files")
  .select("slug, storage_path")
  .in("slug", rows.map((row) => row.slug))
  .order("slug", { ascending: true });

if (publicVerifyError) {
  throw publicVerifyError;
}

console.log(`Upserted ${rows.length} download metadata rows.`);
console.log(`Uploaded ${fullDownloadRows().length + segmentFiles.length} files to ${bucketName}.`);
console.log(`Verified ${data?.length ?? 0} active download rows are queryable by service role.`);
console.log(`Verified ${publicData?.length ?? 0} active download rows are queryable by public metadata policy.`);
