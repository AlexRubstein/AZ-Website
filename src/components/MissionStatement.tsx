"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";

type MissionStatementProps = {
  statement?: string;
  attribution?: string;
  image?: string;
  imageAlt?: string;
};

export function MissionStatement({
  statement = "To develop, maintain, document, and promote an OHV trail system through Eastern Arizona while advancing rider safety, environmental respect, and public awareness.",
  attribution = "Jerry Smith, President",
  image = "/azat/ride/ride-forest.jpg",
  imageAlt = "Forest trail corridor on the Arizona Alpine Trail",
}: MissionStatementProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(textRef, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-34, 34]);

  return (
    <section ref={sectionRef} className="az-mission-statement relative isolate min-h-[82svh] overflow-hidden px-5 py-18 text-white sm:px-8 lg:py-28">
      <motion.div className="absolute inset-0 -z-20" style={{ y: imageY }}>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#07150f_0%,rgba(7,21,15,0.88)_5%,rgba(7,21,15,0.42)_12%,rgba(7,21,15,0)_22%),linear-gradient(90deg,rgba(7,21,15,0.76),rgba(7,21,15,0.34)_48%,rgba(7,21,15,0.08)),linear-gradient(0deg,rgba(7,21,15,0.62),rgba(7,21,15,0.04)_50%,rgba(7,21,15,0.18))]" />

      <div className="mx-auto flex min-h-[62svh] max-w-[1320px] items-center">
        <motion.div
          ref={textRef}
          initial={prefersReducedMotion ? false : { y: 24 }}
          animate={isInView ? { y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative max-w-3xl border-l border-white/28 pl-5 sm:pl-8"
        >
          <p className="az-kicker text-[#f0c477]">Mission</p>
          <blockquote className="mt-6 font-serif text-3xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {statement}
          </blockquote>
          <p className="mt-7 font-mono text-xs font-black uppercase tracking-[0.18em] text-white/72">
            {attribution}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
