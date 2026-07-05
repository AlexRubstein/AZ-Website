import { PageShell } from "@/components/PageShell";
import { downloads, resourceCards } from "@/lib/content";

export default function ResourcesPage() {
  return (
    <PageShell
      title="Resources"
      description="Downloadable trail files, safety guidance, stewardship resources, and partner links can all be managed from Sanity."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {downloads.map((item) => (
          <article key={item.label} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <p className="font-mono text-sm text-[#b74f32]">{item.type}</p>
            <h2 className="mt-8 text-2xl font-semibold">{item.label}</h2>
            <p className="mt-2 text-[#5f6c63]">{item.version}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {resourceCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
              <Icon className="text-[#b74f32]" />
              <h2 className="mt-8 text-2xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-[#5f6c63]">{card.text}</p>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}
