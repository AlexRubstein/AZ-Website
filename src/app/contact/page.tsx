import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Arizona Alpine Trail with route questions, corrections, partnership interest, or general website feedback.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Arizona Alpine Trail",
    description:
      "Send route questions, corrections, partnership interest, or general website feedback to Arizona Alpine Trail.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      description="Send route questions, corrections, partnership interest, or general website feedback."
    >
      <ContactForm />
    </PageShell>
  );
}
