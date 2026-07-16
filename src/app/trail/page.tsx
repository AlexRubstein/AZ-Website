import Link from "next/link";
import { Box } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrailMap } from "@/components/TrailMap";
import { segments } from "@/lib/content";

export default function TrailPage() {
  return (
    <>
      <Header />
      <main className="pt-28">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">Trail system</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">
            The old WordPress trail page becomes a structured route library with segment pages,
            statuses, downloads, town relationships, and map layers.
          </p>
          <Link
            href="/trail/3d"
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#173d2b] px-5 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
          >
            <Box size={16} aria-hidden="true" />
            Open 3D trail view
          </Link>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {segments.map((segment) => (
              <Link key={segment.slug} href={`/trail/${segment.slug}`} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-6">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b74f32]">{segment.status}</p>
                <h2 className="mt-8 text-3xl font-semibold">{segment.title}</h2>
                <p className="mt-3 text-[#5f6c63]">{segment.description}</p>
              </Link>
            ))}
          </div>
        </section>
        <TrailMap />
      </main>
      <Footer />
    </>
  );
}
