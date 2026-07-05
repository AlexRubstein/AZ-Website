import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { towns } from "@/lib/content";

export default function TownsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Trail towns</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">
          Each town can have services, coordinates, lodging notes, economic development content, and
          related trail segments in Sanity.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {towns.map((town) => (
            <Link key={town.slug} href={`/towns/${town.slug}`} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-6">
              <h2 className="text-3xl font-semibold">{town.title}</h2>
              <p className="mt-3 text-[#5f6c63]">{town.description}</p>
              <p className="mt-8 text-sm font-bold text-[#b74f32]">{town.services.join(" / ")}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
