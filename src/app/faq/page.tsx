import { PageShell } from "@/components/PageShell";
import { FaqExplorer } from "@/components/FaqExplorer";

export default function FAQPage() {
  return (
    <PageShell
      title="FAQ"
      description="Everything riders ask before a trip: legal access, maps and downloads, planning, safety, services, and how AZAT works. Search or browse by category."
    >
      <FaqExplorer />
    </PageShell>
  );
}
