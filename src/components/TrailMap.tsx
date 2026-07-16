"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Download, Mountain } from "lucide-react";

import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";
import { resolveDownloadHref } from "@/lib/download-links";
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

export function TrailMap({
  highlights = [],
  downloads = [],
}: TrailMapProps) {
  const prefersReducedMotion = useReducedMotion();
  const highlightIds = useMemo(() => highlights.map(getHighlightId), [highlights]);
  const [selectedId, setSelectedId] = useState("");
  const handleHighlightSelect = useCallback((id: string) => setSelectedId(id), []);
  const selectedIndex = selectedId ? Math.max(0, highlightIds.indexOf(selectedId)) : 0;
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
  const quietDownloads = downloads.slice(0, 3);
  const selectedFacts = selected?.facts?.slice(0, 3) || [];

  return (
    <section id="trail-map" className="az-map-experience relative isolate overflow-hidden bg-[#f4f1e8] text-[#13221a]">
      <div className="mx-auto max-w-[1540px] px-3 py-3 sm:px-5 lg:px-8 xl:py-8">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-stretch">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.36, ease: "easeOut" }}
          className="relative min-h-[430px] overflow-hidden rounded-[6px] border border-[#cfd7cb] bg-[#cad4c2] shadow-[0_32px_80px_rgba(19,34,26,0.18)] sm:min-h-[520px] xl:min-h-[760px]"
        >
          <div className="relative min-h-[430px] sm:min-h-[520px] xl:min-h-[760px]">
            <LeafletRouteMap
              highlights={highlights}
              activeHighlightId={selectedId || undefined}
              onHighlightSelect={handleHighlightSelect}
            />
          </div>

          <div className="absolute right-3 top-3 z-[420]">
            <motion.div whileHover={prefersReducedMotion ? undefined : { y: -2 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}>
              <Link
                href="/trail/3d"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#e5b96f] bg-[#173d2b] px-4 text-xs font-black uppercase tracking-[0.1em] text-white shadow-[0_10px_28px_rgba(19,34,26,0.28)] backdrop-blur transition hover:bg-[#e5b96f] hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5b96f]"
              >
                <Mountain size={14} aria-hidden="true" />
                View in 3D
              </Link>
            </motion.div>
          </div>

          {quietDownloads.length ? (
            <div id="downloads" className="absolute bottom-3 left-3 z-[420] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
              {quietDownloads.map((download) => (
                <ProtectedDownloadLink
                  key={`${download.label}-${download.href || download.value || ""}`}
                  href={resolveDownloadHref(download.href)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d8ded4] bg-[#fffdf7]/94 px-3.5 text-xs font-black uppercase tracking-[0.1em] text-[#173d2b] shadow-[0_10px_28px_rgba(19,34,26,0.16)] backdrop-blur transition hover:border-[#b74f32] hover:text-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b74f32]"
                >
                  <Download size={14} aria-hidden="true" />
                  {download.value || download.label}
                </ProtectedDownloadLink>
              ))}
            </div>
          ) : null}
        </motion.div>

        <div className="relative z-[430] xl:flex xl:min-h-[760px]">
          {selected ? (
            <motion.div
              className="flex w-full flex-col overflow-hidden rounded-[6px] border border-[#d8ded4] bg-[#fffdf7] text-[#13221a] shadow-[0_18px_44px_rgba(19,34,26,0.12)]"
            >
              <div className="relative h-36 overflow-hidden sm:h-60 xl:h-[380px]">
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
                      sizes="(min-width: 1280px) 400px, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute left-3 top-3 rounded-full bg-[#fffdf7]/92 px-3 py-1.5 font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#9b5d2e] shadow-[0_10px_26px_rgba(19,34,26,0.16)] backdrop-blur">
                  {selectedIndex + 1} / {highlights.length}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4 xl:p-5">
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
                    {selected.note ? <p className="mt-2 hidden text-sm leading-5 text-[#5f6c63] sm:block sm:max-w-2xl xl:max-w-none">{selected.note}</p> : null}
                  </motion.div>
                </AnimatePresence>
                {selectedFacts.length ? (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:mt-5 xl:grid-cols-1">
                    {selectedFacts.map((fact) => (
                      <div key={`${fact.label}-${fact.value || fact.description || ""}`} className="flex min-h-10 items-center justify-between gap-4 border-t border-[#d8ded4] pt-2">
                        <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-[#8a958c]">{fact.label}</span>
                        <span className="text-right text-sm font-semibold text-[#173d2b]">{fact.value || fact.description}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {showCarouselControls ? (
                  <div className="mt-auto flex items-center justify-between gap-3 pt-4 xl:pt-5">
                    <motion.button
                      type="button"
                      aria-label="View previous trail highlight"
                      onClick={showPreviousHighlight}
                      whileHover={prefersReducedMotion ? undefined : { x: -2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                      className="grid size-10 place-items-center rounded-full bg-[#13221a] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173d2b]"
                    >
                      <ChevronLeft size={18} aria-hidden="true" />
                    </motion.button>
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.14em] text-[#8a958c]">
                      Trail highlight
                    </span>
                    <motion.button
                      type="button"
                      aria-label="View next trail highlight"
                      onClick={showNextHighlight}
                      whileHover={prefersReducedMotion ? undefined : { x: 2 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                      className="grid size-10 place-items-center rounded-full bg-[#13221a] text-white transition hover:bg-[#b74f32] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173d2b]"
                    >
                      <ChevronRight size={18} aria-hidden="true" />
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>
        </div>
      </div>
    </section>
  );
}
