"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type GalleryPhoto = {
  url: string;
  alt?: string;
};

const AUTO_ADVANCE_MS = 5000;

const arrowButtonClass =
  "absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-[#08130d]/55 text-white backdrop-blur-sm transition hover:bg-[#08130d]/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (photos.length > 1 && event.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
      if (photos.length > 1 && event.key === "ArrowRight") onNavigate((index + 1) % photos.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, onClose, onNavigate, photos.length]);

  const photo = photos[index];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08130d]/92 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt || "Photo"}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X size={20} aria-hidden="true" />
      </button>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
            className={`${arrowButtonClass} left-2 sm:left-4`}
          >
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNavigate((index + 1) % photos.length);
            }}
            aria-label="Next photo"
            className={`${arrowButtonClass} right-2 sm:right-4`}
          >
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </>
      ) : null}

      <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
        <Image src={photo.url} alt={photo.alt || ""} fill sizes="90vw" className="object-contain" priority />
      </div>
    </div>
  );
}

export function PhotoGallery({ photos, title }: { photos: GalleryPhoto[]; title: string }) {
  const prefersReducedMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      if (!photos.length) return;
      const wrapped = (index + photos.length) % photos.length;
      itemRefs.current[wrapped]?.scrollIntoView({ behavior, inline: "start", block: "nearest" });
      setActiveIndex(wrapped);
    },
    [photos.length],
  );

  // Keep activeIndex in sync when the rider swipes/scrolls the strip manually.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || photos.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const index = itemRefs.current.findIndex((el) => el === mostVisible.target);
        if (index >= 0) setActiveIndex(index);
      },
      { root: container, threshold: [0.6] },
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [photos.length]);

  // Auto-advance, paused on hover/focus and disabled entirely for reduced-motion.
  useEffect(() => {
    if (prefersReducedMotion || isPaused || lightboxIndex != null || photos.length < 2) return;
    const timer = setTimeout(() => goTo(activeIndex + 1), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, goTo, isPaused, lightboxIndex, photos.length, prefersReducedMotion]);

  if (!photos.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.url}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="relative aspect-[4/3] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[6px] sm:w-[420px]"
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View full size: ${photo.alt || `${title} photo ${index + 1}`}`}
              className="group absolute inset-0"
            >
              <Image
                src={photo.url}
                alt={photo.alt || `${title} trail photo ${index + 1}`}
                fill
                sizes="(min-width: 640px) 420px, 78vw"
                priority={index === 0}
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </div>
        ))}
      </div>

      {photos.length > 1 ? (
        <>
          <button type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Previous photo" className={`${arrowButtonClass} left-2 sm:left-4`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Next photo" className={`${arrowButtonClass} right-2 sm:right-4`}>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </>
      ) : null}

      {lightboxIndex != null ? (
        <Lightbox photos={photos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      ) : null}
    </div>
  );
}
