export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-03";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ymwkx711";
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "/studio";
export const hasConfiguredSanityProject = Boolean(projectId);
