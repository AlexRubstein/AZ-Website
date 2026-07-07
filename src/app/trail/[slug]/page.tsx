import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { downloads, segments } from "@/lib/content";

export function generateStaticParams() {
  return segments.map((segment) => ({ slug: segment.slug }));
}

export default async function TrailSegmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const segment = segments.find((item) => item.slug === slug);
  if (!segment) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#b74f32]">{segment.code} / {segment.status}</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">{segment.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">{segment.description}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <p className="text-sm text-[#5f6c63]">Mileage</p>
            <p className="mt-3 text-3xl font-semibold">{segment.mileage}</p>
          </div>
          {downloads.map((download) => (
            <div key={download.label} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
              <p className="text-sm text-[#5f6c63]">{download.type}</p>
              <p className="mt-3 text-xl font-semibold">{download.label}</p>
              <ProtectedDownloadLink
                href={download.href}
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#13221a] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
              >
                Download
              </ProtectedDownloadLink>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
