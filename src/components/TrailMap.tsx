"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

import type { HomeDownload, HomeMapLayer, HomeTrailHighlight } from "@/lib/home";
import type { LeafletRouteMapProps } from "@/components/LeafletRouteMap";

type TrailMapProps = {
  title?: string;
  copy?: string;
  layers?: HomeMapLayer[];
  highlights?: HomeTrailHighlight[];
  downloads?: HomeDownload[];
};

const LeafletRouteMap = dynamic<LeafletRouteMapProps>(
  () => import("@/components/LeafletRouteMap").then((module) => module.LeafletRouteMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 grid place-items-center bg-[#cad4c2] text-[#173d2b]">
        <div className="rounded-full bg-[#fffdf7]/90 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] shadow-xl">
          Loading route map
        </div>
      </div>
    ),
  },
);

function getHighlightId(highlight: HomeTrailHighlight, index: number) {
  return highlight._key || `${highlight.title}-${index}`;
}

export function TrailMap({ highlights = [] }: TrailMapProps) {
  const prefersReducedMotion = useReducedMotion();
  const highlightIds = useMemo(() => highlights.map(getHighlightId), [highlights]);
  const [selectedId, setSelectedId] = useState(highlightIds[0] || "");
  const handleHighlightSelect = useCallback((id: string) => setSelectedId(id), []);
  const selectedIndex = Math.max(0, highlightIds.indexOf(selectedId));
  const selected = highlights[selectedIndex] || highlights[0];
  const selectedImage = selected?.image || "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg";
  const selectedImageAlt = selected?.imageAlt || selected?.title || "Arizona Alpine Trail highlight";
  const showCarouselControls = highlights.length > 1;
  const selectHighlightAt = useCallback(
    (index: number) => {
      if (!highlightIds.length) return;
      const nextIndex = (index + highlightIds.length) % highlightIds.length;
      setSelectedId(highlightIds[nextIndex]);
    },
    [highlightIds],
  );
  const showPreviousHighlight = useCallback(() => selectHighlightAt(selectedIndex - 1), [selectHighlightAt, selectedIndex]);
  const showNextHighlight = useCallback(() => selectHighlightAt(selectedIndex + 1), [selectHighlightAt, selectedIndex]);

  return (
    <section id="trail-map" className="az-map-experience relative isolate overflow-hidden bg-[#13221a] text-white">
      <Image
        src="/azat/photos/731417674_1315204040827648_8190236298013485636_n.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-64"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,21,15,0.86),rgba(7,21,15,0.54)_44%,rgba(7,21,15,0.84))]" />

      <div className="mx-auto grid max-w-[1540px] gap-5 px-5 py-14 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:py-20">
        <div className="relative z-[430] lg:flex lg:min-h-[720px] lg:items-center">
          {selected ? (
            <motion.div
              className="w-full overflow-hidden rounded-[6px] border border-white/16 bg-[#fffdf7]/94 text-[#13221a] shadow-[0_18px_48px_rgba(0,0,0,0.2)] backdrop-blur"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedImage}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.035 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={selectedImage}
                      alt={selectedImageAlt}
                      fill
                      sizes="(min-width: 1024px) 260px, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="p-3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={getHighlightId(selected, selectedIndex)}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="min-w-0"
                  >
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#9b5d2e]">
                      {selected.category || "Highlight"}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold leading-tight">{selected.title}</h3>
                    {selected.note ? <p className="mt-2 text-sm leading-5 text-[#5f6c63]">{selected.note}</p> : null}
                  </motion.div>
                </AnimatePresence>
                {showCarouselControls ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <motion.button
                      type="button"
                      aria-label="View previous trail highlight"
                      onClick={showPreviousHighlight}
                      whileHover={prefersReducedMotion ? undefined : { x: -2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                      className="grid size-10 place-items-center rounded-full bg-[#13221a] text-white transition hover:bg-[#9b5d2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173d2b]"
                    >
                      <ChevronLeft size={18} aria-hidden="true" />
                    </motion.button>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#8a958c]">
                      {selectedIndex + 1} / {highlights.length}
                    </span>
                    <motion.button
                      type="button"
                      aria-label="View next trail highlight"
                      onClick={showNextHighlight}
                      whileHover={prefersReducedMotion ? undefined : { x: 2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                      className="grid size-10 place-items-center rounded-full bg-[#13221a] text-white transition hover:bg-[#9b5d2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173d2b]"
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="relative min-h-[600px] overflow-hidden rounded-[6px] bg-[#0b1710] shadow-[0_40px_110px_rgba(0,0,0,0.36)] lg:min-h-[720px]"
        >
          <div className="relative min-h-[600px] lg:min-h-[720px]">
            <LeafletRouteMap
              highlights={highlights}
              activeHighlightId={selected ? getHighlightId(selected, selectedIndex) : undefined}
              onHighlightSelect={handleHighlightSelect}
            />
          </div>

          <div id="downloads" className="relative z-[420] p-2.5 lg:absolute lg:right-3 lg:top-3 lg:p-0">
            <motion.a
              href="/resources"
              whileHover={prefersReducedMotion ? undefined : { y: -2 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
              className="group flex min-h-14 items-center justify-between gap-3 rounded-[3px] bg-[#e11f3f] px-4 py-2.5 text-white shadow-[0_18px_48px_rgba(19,34,26,0.28)] transition hover:bg-[#bf1832] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/72">Map files</span>
                <span className="mt-0.5 block text-sm font-semibold">Open Downloads</span>
              </span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-[#e11f3f] transition group-hover:scale-105">
                <Download size={16} aria-hidden="true" />
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
