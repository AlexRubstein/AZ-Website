import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { downloads, resourceCards } from "@/lib/content";
import { officialResources } from "@/lib/faq-content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Download current Arizona Alpine Trail route files and find official OHV safety, permit, forest, and highway condition resources.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Arizona Alpine Trail Resources",
    description:
      "Current AZAT downloads plus official OHV safety, permit, forest, and highway condition resources.",
    url: "/resources",
  },
};

export default function ResourcesPage() {
  return (
    <PageShell
      title="Resources"
      description="Download the current trail files, then verify permits, closures, weather, forest rules, and highway conditions before you ride."
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
      <section className="mt-10 border-t border-[#d8ded4] pt-10" aria-labelledby="official-resources">
        <div className="max-w-3xl">
          <h2 id="official-resources" className="text-3xl font-semibold tracking-tight text-[#13221a]">
            Official Links
          </h2>
          <p className="mt-3 text-base leading-7 text-[#5f6c63]">
            Use these agency and partner resources to confirm registration, permits, closures, maps, and current conditions.
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {officialResources.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target={resource.external ? "_blank" : undefined}
              rel={resource.external ? "noopener noreferrer" : undefined}
              className="group flex min-h-14 items-center justify-between gap-4 rounded-sm border border-[#d8ded4] bg-[#fffdf7] px-4 py-3 text-sm font-semibold text-[#13221a] transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
            >
              <span>{resource.label}</span>
              {resource.external ? (
                <ExternalLink
                  size={16}
                  className="shrink-0 text-[#b74f32] transition group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              ) : null}
            </a>
          ))}
        </div>
      </section>
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
