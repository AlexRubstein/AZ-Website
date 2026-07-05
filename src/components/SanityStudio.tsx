"use client";

import config from "../../sanity.config";
import { NextStudio } from "next-sanity/studio";

export function SanityStudio() {
  return <NextStudio config={config} />;
}
