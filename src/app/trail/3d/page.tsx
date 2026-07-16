import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TrailTerrainMap } from "@/components/TrailTerrainMap";

export const metadata: Metadata = {
  title: "3D Trail View",
  description: "Explore the Arizona Alpine Trail route in a 3D terrain view.",
};

export default function Trail3DPage() {
  return (
    <>
      <Header />
      <main id="main">
        <TrailTerrainMap />
      </main>
    </>
  );
}
