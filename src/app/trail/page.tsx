import Link from "next/link";
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
