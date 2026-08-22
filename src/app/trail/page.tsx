import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TrailHubExperience } from "@/components/TrailHubExperience";
import { getTrailHubSegments } from "@/lib/trail-segments";

export const metadata: Metadata = {
  title: "The Trail — Arizona Alpine Trail",
  description: "28 real segments across the 674-mile Arizona Alpine Trail loop, mapped from AZAT's own GPX survey.",
};

export default async function TrailPage() {
  const segments = await getTrailHubSegments();

  return (
    <>
      <Header />
      <TrailHubExperience segments={segments} />
      <Footer />
    </>
  );
}
