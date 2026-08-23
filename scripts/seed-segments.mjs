import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

import { buildSegmentPageData, listSegmentContentSlugs } from "../src/lib/segment-content.mjs";

// Narrowly-scoped sibling to seed-sanity.mjs: commits ONLY trailSegment + downloadFile documents
// built from public/azat/segments/. Unlike the full seed script, this never touches homePage,
// towns, news, faq, resources, products, or redirects — safe to run against a dataset that
// already has real hand-edited content for those.

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ymwkx711";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03";
const token = process.env.SANITY_AUTH_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_AUTH_TOKEN. Create a Sanity token with write access and rerun this script.");
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const slug = (current) => ({ _type: "slug", current });

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

// Uploads the actual file bytes to Sanity's asset store (not just a URL reference), so the
// resulting image is a real Sanity asset — editable/replaceable by anyone in Studio, from
// anywhere, with no code change or redeploy. Sanity dedupes identical uploads by content hash,
// so re-running this script is safe.
async function uploadLocalImage(localUrl, alt) {
  if (!localUrl) return undefined;
  const filePath = resolve("public" + localUrl);
  const buffer = readFileSync(filePath);
  const filename = localUrl.split("/").pop();
  const asset = await client.assets.upload("image", buffer, { filename });
  console.log(`  uploaded ${localUrl} -> ${asset._id}`);
  return { _type: "externalImage", image: { _type: "image", asset: { _type: "reference", _ref: asset._id } }, alt };
}

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

const documents = [...segmentDownloadDocs, ...segmentDocs];

const transaction = client.transaction();
for (const doc of documents) {
  transaction.createOrReplace(doc);
}

await transaction.commit();

console.log(`Seeded ${segmentDocs.length} trailSegment + ${segmentDownloadDocs.length} downloadFile documents into ${projectId}/${dataset}.`);
