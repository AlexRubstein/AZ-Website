"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Route } from "lucide-react";

import type { HomeItineraryCard } from "@/lib/home";

type ItineraryFeatureProps = {
  title?: string;
  image?: string;
  imageAlt?: string;
  href?: string;
  cards?: HomeItineraryCard[];
};

function getCardId(card: HomeItineraryCard, index: number) {
  return card._key || `${card.title}-${index}`;
}

export function ItineraryFeature({
  title = "Rusty's Route 1000",
  image = "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg",
  imageAlt = "Arizona Alpine Trail route terrain for Rusty's Route 1000 itinerary",
  href = "/rustys-route-1000",
  cards = [],
}: ItineraryFeatureProps) {
  const prefersReducedMotion = useReducedMotion();
  const featured = cards[0] || {
    title,
    href,
    image,
    imageAlt,
    label: "Featured itinerary",
    miles: "1,000 mi",
    days: "11 days",
    status: "Available",
  };
  const railCards = cards.length ? cards : [featured];
  const showRail = railCards.length > 1;
  const featuredHref = featured.href || href;
  const featuredImage = featured.image || image;
  const featuredImageAlt = featured.imageAlt || imageAlt;

  return (
    <section id="itineraries" className="relative isolate overflow-hidden bg-[#07150f] text-white">
      <Image
        src="/azat/photos/735799434_1320342236980495_6791231310356729871_n.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-62"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,21,15,0.84),rgba(7,21,15,0.44)_46%,rgba(7,21,15,0.86))]" />

      <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)] lg:items-end">
          <Link
            href={featuredHref}
            className="group relative block min-h-[380px] overflow-hidden rounded-[6px] bg-[#13221a] shadow-[0_34px_100px_rgba(0,0,0,0.34)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-h-[460px] lg:min-h-[560px]"
            aria-label={`View ${featured.title}`}
          >
            <Image
              src={featuredImage}
              alt={featuredImageAlt}
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-[1.025]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,15,0)_26%,rgba(7,21,15,0.7))]" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <p className="az-kicker text-[#f0c477]">{featured.label || "Itinerary"}</p>
              <h2 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[0.98] text-white sm:text-5xl lg:text-6xl">
                {featured.title}
              </h2>
            </div>
          </Link>

          <div>
            <p className="az-kicker text-[#f0c477]">Route Options</p>
            <h3 className="mt-3 max-w-md font-serif text-3xl font-semibold leading-[1] text-white sm:text-4xl">
              Start with the route that is ready.
            </h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {featured.miles ? (
                <div className="rounded-[6px] bg-white/12 p-4 backdrop-blur">
                  <Route className="text-[#f0c477]" size={20} aria-hidden="true" />
                  <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/58">Miles</p>
                  <p className="mt-1 text-2xl font-semibold">{featured.miles}</p>
                </div>
              ) : null}
              {featured.days ? (
                <div className="rounded-[6px] bg-white/12 p-4 backdrop-blur">
                  <CalendarDays className="text-[#f0c477]" size={20} aria-hidden="true" />
                  <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-white/58">Timing</p>
                  <p className="mt-1 text-2xl font-semibold">{featured.days}</p>
                </div>
              ) : null}
            </div>
            <Link
              href={featuredHref}
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-xs font-black uppercase tracking-[0.12em] text-[#13221a] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Itinerary
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {showRail ? (
          <div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2">
            {railCards.map((card, index) => {
              const cardImage = card.image || image;
              const cardHref = card.href || href;
              const isAvailable = (card.status || "Available") === "Available";

              return (
                <motion.div
                  key={getCardId(card, index)}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : index * 0.04 }}
                  className="min-w-[280px] snap-start sm:min-w-[360px]"
                >
                  <Link
                    href={cardHref}
                    aria-label={`View ${card.title}`}
                    className={`group block overflow-hidden rounded-[6px] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_58px_rgba(0,0,0,0.28)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                      isAvailable ? "hover:-translate-y-1" : "pointer-events-none opacity-72"
                    }`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={cardImage}
                        alt={card.imageAlt || card.title}
                        fill
                        sizes="360px"
                        className="object-cover transition duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#9b5d2e]">{card.status || "Available"}</p>
                        <ArrowRight size={15} aria-hidden="true" />
                      </div>
                      <h4 className="mt-2 text-xl font-semibold">{card.title}</h4>
                      <p className="mt-2 text-sm text-[#5f6c63]">
                        {[card.miles, card.days].filter(Boolean).join(" / ") || card.label || "Route option"}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
