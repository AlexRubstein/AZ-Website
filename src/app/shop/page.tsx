import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Shop",
  description: "Arizona Alpine Trail merchandise is coming soon. Future purchases will support the trail.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Arizona Alpine Trail Shop",
    description: "Arizona Alpine Trail merchandise is coming soon. Future purchases will support the trail.",
    url: "/shop",
  },
};

export default function ShopPage() {
  return (
    <PageShell
      title="Shop coming soon"
      description="Every future purchase will support the trail."
    />
  );
}
