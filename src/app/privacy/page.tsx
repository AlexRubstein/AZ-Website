import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Arizona Alpine Trail privacy information and website data practices.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy",
    description: "Arizona Alpine Trail privacy information and website data practices.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy"
      description="Legal content is preserved as editable Sanity page content. Final copy should be reviewed by the client before launch."
    />
  );
}
