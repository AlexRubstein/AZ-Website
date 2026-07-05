import { PageShell } from "@/components/PageShell";

const faqs = [
  ["Is the trail official?", "The current route content should distinguish proposed, preliminary, seasonal, open, and closed status in Sanity."],
  ["Can I download trail files?", "Yes. GPX, KML, shapefile, PDF, and external links are modeled as versioned download documents."],
  ["Can the site take donations?", "The schema is ready for Stripe-backed donation campaigns when payments become a launch requirement."],
];

export default function FAQPage() {
  return (
    <PageShell title="FAQ" description="Frequently asked questions become editable Sanity documents grouped by category.">
      <div className="grid gap-3">
        {faqs.map(([question, answer]) => (
          <article key={question} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <h2 className="text-xl font-semibold">{question}</h2>
            <p className="mt-2 text-[#5f6c63]">{answer}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
