"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Download, MapPinned } from "lucide-react";
import { ProtectedDownloadLink } from "@/components/auth/ProtectedDownloadLink";

type PhotoMoment = {
  title: string;
  image: string;
  alt: string;
};

const moments: PhotoMoment[] = [
  {
    title: "The line.",
    image: "/azat/photos/732464060_1314291140918938_8655586887586886350_n.jpg",
    alt: "Open high-country trail landscape on the Arizona Alpine Trail",
  },
  {
    title: "The map.",
    image: "/azat/photos/735761389_1318522053829180_4711200860303823554_n.jpg",
    alt: "Wide Arizona mountain trail view with forest and sky",
  },
  {
    title: "The GPX.",
    image: "/azat/photos/733890453_1316837243997661_6044422898535499635_n.jpg",
    alt: "Arizona alpine forest road and mountain terrain",
  },
];

function PhotoMomentCard({
  moment,
  index,
  progress,
  reducedMotion,
}: {
  moment: PhotoMoment;
  index: number;
  progress: MotionValue<number>;
  reducedMotion: boolean | null;
}) {
  const y = useTransform(progress, [0, 1], reducedMotion ? [0, 0] : [index * 12, index * -18]);

  return (
    <motion.article
      className="group relative min-h-[500px] overflow-hidden rounded-[4px] bg-[#13221a] shadow-[0_34px_100px_rgba(0,0,0,0.3)]"
      style={{ y }}
    >
      <Image
        src={moment.image}
        alt={moment.alt}
        fill
        sizes="(min-width: 1024px) 54vw, 100vw"
        className="object-cover transition duration-500 group-hover:scale-[1.025]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,15,0),rgba(7,21,15,0.34))]" />
      <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7">
        <h3 className="rounded-full bg-[#07150f]/60 px-4 py-2 font-serif text-2xl font-semibold leading-none text-white backdrop-blur-sm sm:text-3xl">{moment.title}</h3>
      </div>
    </motion.article>
  );
}

export function PhotoTrailSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-36, 36]);
  const progressScale = useTransform(scrollYProgress, [0.08, 0.92], [0, 1]);

  return (
    <section ref={sectionRef} className="az-photo-sequence relative isolate overflow-hidden bg-[#07150f] px-5 py-14 text-white sm:px-8 lg:py-20">
      <motion.div className="absolute inset-0 -z-20" style={{ y: backgroundY }}>
        <Image
          src="/azat/photos/739451229_1320342256980493_2950837279949210611_n.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-78"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,21,15,0.58),rgba(7,21,15,0.16)_42%,rgba(7,21,15,0.58))]" />

      <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
        <div className="top-28 lg:sticky">
          <h2 className="max-w-sm font-serif text-4xl font-semibold leading-none text-white sm:text-5xl lg:text-6xl">Trail, map, GPX.</h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Link href="#trail-map" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black uppercase tracking-[0.1em] text-[#13221a] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <MapPinned size={17} aria-hidden="true" />
              View Map
            </Link>
            <ProtectedDownloadLink href="/downloads/arizona-alpine-trail-gpx" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e11f3f] px-5 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              <Download size={17} aria-hidden="true" />
              Download GPX
            </ProtectedDownloadLink>
          </div>
          <div className="mt-10 h-1 w-full max-w-sm overflow-hidden rounded-full bg-white/18" aria-hidden="true">
            <motion.div className="h-full origin-left rounded-full bg-[#f0c477]" style={{ scaleX: prefersReducedMotion ? 1 : progressScale }} />
          </div>
        </div>

        <div className="grid gap-6">
          {moments.map((moment, index) => (
            <PhotoMomentCard
              key={moment.title}
              moment={moment}
              index={index}
              progress={scrollYProgress}
              reducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
