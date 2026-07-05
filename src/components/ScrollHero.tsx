"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Download, MapPinned } from "lucide-react";

import type { HomeCta } from "@/lib/home";

type HeroStat = {
  label: string;
  value: string;
};

type ScrollHeroProps = {
  title: string;
  copy?: string;
  image?: string;
  imageAlt?: string;
  primaryCta?: HomeCta;
  secondaryCta?: HomeCta;
  stats?: HeroStat[];
};

export function ScrollHero({
  title,
  copy,
  image,
  imageAlt,
  primaryCta,
  secondaryCta,
}: ScrollHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.02]);
  const imageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -8]);
  const contentY = useTransform(scrollYProgress, [0, 0.86], prefersReducedMotion ? [0, 0] : [0, -20]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.96, 0.74]);

  return (
    <section ref={sectionRef} className="az-scroll-hero bg-[#07150f] text-white" aria-labelledby="home-hero-title">
      <div className="az-scroll-hero-stage">
        <motion.div
          className="az-scroll-hero-image"
          style={{
            scale: imageScale,
            y: imageY,
            position: "absolute",
            top: "-5vh",
            right: "-4vw",
            bottom: "-5vh",
            left: "-4vw",
          }}
        >
          <Image
            src={image || "/azat/photos/732464060_1314291140918938_8655586887586886350_n.jpg"}
            alt={imageAlt || ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="az-scroll-hero-scrim" />
        <div className="az-scroll-hero-gradient" />

        <motion.div className="az-scroll-hero-content az-scroll-hero-content--simple" style={{ y: contentY, opacity: contentOpacity }}>
          <div className="az-hero-lockup">
            <div className="az-hero-copy">
              <div className="az-hero-logo">
                <Image
                  src="/azat/brand/azat-logo.png"
                  alt="Arizona Alpine Trail"
                  width={553}
                  height={618}
                  priority
                  className="h-full w-auto object-contain"
                />
              </div>
              <h1 id="home-hero-title" className="az-hero-title text-white">
                {title}
              </h1>
              {copy ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">{copy}</p> : null}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={primaryCta?.href || "#trail-map"}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black uppercase tracking-[0.1em] text-[#13221a] transition hover:bg-[#f0c477] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MapPinned size={18} aria-hidden="true" />
                  {primaryCta?.label || "View Map"}
                </Link>
                <Link
                  href={secondaryCta?.href || "/azat/downloads/arizona-alpine-trail.gpx"}
                  className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#e11f3f] px-6 text-sm font-black uppercase tracking-[0.1em] text-white transition hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Download size={18} aria-hidden="true" />
                  {secondaryCta?.label || "Download GPX"}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
