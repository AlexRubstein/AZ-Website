import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Arizona Alpine Trail, Inc., the nonprofit developing and documenting a responsible OHV route system across Eastern Arizona.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Arizona Alpine Trail",
    description:
      "Arizona Alpine Trail, Inc. promotes responsible OHV travel, stewardship, and rural trail tourism across Eastern Arizona.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <PageShell
      title="About AZAT"
      description="Arizona Alpine Trail, Inc. is a nonprofit 501(c)(3) established to educate, promote OHV safety, respect the environment, and connect Eastern Arizona communities through trail tourism."
    />
  );
}
