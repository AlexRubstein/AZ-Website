import { PageShell } from "@/components/PageShell";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { downloads, resourceCards } from "@/lib/content";

export default function ResourcesPage() {
  return (
    <PageShell
      title="Resources"
      description="Downloadable trail files are protected through Supabase, alongside safety guidance, stewardship resources, and partner links."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {downloads.map((item) => (
          <article key={item.label} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <p className="font-mono text-sm text-[#b74f32]">{item.type}</p>
            <h2 className="mt-8 text-2xl font-semibold">{item.label}</h2>
            <p className="mt-2 text-[#5f6c63]">{item.version}</p>
            <ProtectedDownloadLink
              href={item.href}
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#13221a] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              Download
            </ProtectedDownloadLink>
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
