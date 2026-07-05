import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { towns } from "@/lib/content";

export function generateStaticParams() {
  return towns.map((town) => ({ slug: town.slug }));
}

export default async function TownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const town = towns.find((item) => item.slug === slug);
  if (!town) notFound();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-36 sm:px-8">
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#b74f32]">Trail town</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-7xl">{town.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#5f6c63]">{town.description}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          {town.services.map((service) => (
            <span key={service} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] px-4 py-3 text-sm font-bold">
              {service}
            </span>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
