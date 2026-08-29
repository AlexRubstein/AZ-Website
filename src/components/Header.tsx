"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { AuthHeaderControls } from "@/components/auth/AuthHeaderControls";
// Fire advisory disabled for now — see note near <FireAlertBanner> below.
// import { FireAlertBanner } from "@/components/FireAlertBanner";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const useSolidHeader = pathname !== "/" || scrolled;
  const on3DPage = pathname?.startsWith("/trail/3d");
  const navItems = [
    {
      label: "Trail",
      href: "/trail",
      current: pathname === "/trail" || (pathname?.startsWith("/trail/") && !on3DPage),
    },
    {
      label: "FAQ",
      href: "/faq",
      current: pathname === "/faq",
      className: "hidden min-[420px]:inline-flex",
    },
    {
      label: "Shop",
      href: "/shop",
      current: pathname === "/shop",
    },
  ];

  useEffect(() => {
    const updateHeaderState = () => {
      setScrolled(window.scrollY > 24);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateHeaderState);
    };
  }, []);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition duration-300 ${
        useSolidHeader
          ? "border-b border-white/12 bg-[#07150f]/88 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl"
          : "border-b border-white/0 bg-[#07150f]/8 shadow-none backdrop-blur-sm"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-[#13221a]"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex min-h-15 max-w-[1320px] items-center justify-between gap-2 px-3 sm:gap-6 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label="Arizona Alpine Trail home">
          <span className={`grid size-11 place-items-center rounded-full p-1 transition duration-300 ${
            useSolidHeader ? "bg-white/88 shadow-[0_8px_22px_rgba(0,0,0,0.16)]" : "bg-white/70 shadow-none"
          }`} aria-hidden="true">
            <Image
              src="/azat/brand/azat-logo.png"
              alt=""
              width={553}
              height={618}
              className="h-full w-auto object-contain"
              priority
            />
          </span>
          <span className="font-mono text-xs font-black uppercase leading-[1.05] tracking-[0.12em]">
            Arizona
            <span className="block">Alpine Trail</span>
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.current ? "page" : undefined}
              className={`${item.className ?? "inline-flex"} min-h-11 items-center whitespace-nowrap rounded-full px-1 text-sm font-semibold transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-3 ${
                item.current ? "text-white" : "text-white/78"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/trail/3d"
            aria-current={on3DPage ? "page" : undefined}
            className={`hidden items-center gap-1.5 rounded-full border px-4 py-2 font-mono text-[11px] font-black uppercase tracking-[0.12em] transition duration-200 sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              on3DPage
                ? "border-[#f1b65a] bg-[#13221a] text-[#f1b65a] shadow-[0_6px_18px_rgba(241,182,90,0.22)]"
                : "border-[#f1b65a]/70 bg-gradient-to-b from-[#f6c877] to-[#e5a94f] text-[#13221a] shadow-[0_6px_18px_rgba(241,182,90,0.45)] hover:-translate-y-0.5 hover:from-[#f8d38c] hover:to-[#eab558] hover:shadow-[0_10px_26px_rgba(241,182,90,0.6)]"
            }`}
          >
            <Mountain size={14} aria-hidden="true" />
            3D Map
          </Link>
          {/* TEMP-DEMO: badge hidden while previewing thin strip, revert after screenshot */}
          <AuthHeaderControls />
          <AuthHeaderControls compact />
        </div>
      </div>
    </header>
    {/* Fire advisory disabled for now (WFIGS "active" heuristic produces too many false positives,
        FIRMS satellite feed still lacks FIRMS_MAP_KEY). Re-enable by restoring this line —
        the API route, cron, and data pipeline are untouched. */}
    {/* <FireAlertBanner variant="thinStrip" /> */}
    </>
  );
}
