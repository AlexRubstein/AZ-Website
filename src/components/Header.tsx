"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Trail", href: "/trail" },
  { label: "Map", href: "/#trail-map" },
  { label: "Downloads", href: "/#downloads" },
  { label: "Itineraries", href: "/#itineraries" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sectionIds = ["trail-map", "downloads", "itineraries"];
    const updateHeaderState = () => {
      setScrolled(window.scrollY > 24);

      if (pathname !== "/") {
        setActiveHash("");
        return;
      }

      let current = "";

      for (const id of sectionIds) {
        const element = document.getElementById(id);

        if (element && element.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }

      setActiveHash(current ? `#${current}` : window.location.hash);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("hashchange", updateHeaderState);
    return () => {
      window.removeEventListener("scroll", updateHeaderState);
      window.removeEventListener("hashchange", updateHeaderState);
    };
  }, [pathname]);

  const isNavActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.slice(1);
    }

    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition duration-300 ${
        scrolled
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
      <div className="mx-auto flex min-h-15 max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label="Arizona Alpine Trail home">
          <span className={`grid size-11 place-items-center rounded-full p-1 transition duration-300 ${
            scrolled ? "bg-white/88 shadow-[0_8px_22px_rgba(0,0,0,0.16)]" : "bg-white/70 shadow-none"
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
        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/6 px-1.5 py-1.5 backdrop-blur-md lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = isNavActive(item.href);

            return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                active ? "bg-white text-[#13221a]" : "text-white/76 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative lg:hidden">
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-primary-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-white/10 text-white transition hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              <span className="sr-only">Menu</span>
            </button>
            {menuOpen ? (
              <nav
                id="mobile-primary-navigation"
                className="absolute right-0 top-13 grid min-w-64 gap-1 rounded-[8px] border border-white/14 bg-[#07150f]/96 p-2 text-white shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                aria-label="Primary navigation"
              >
                {navItems.map((item) => {
                  const active = isNavActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={`min-h-11 rounded-[6px] px-3 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        active ? "bg-white text-[#13221a]" : "text-white/76 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            ) : null}
          </div>
          <Link
            href="/azat/downloads/arizona-alpine-trail.gpx"
            className="hidden min-h-11 items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-white/28 hover:bg-white hover:text-[#13221a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
          >
            <Download size={16} />
            GPX
          </Link>
        </div>
      </div>
    </header>
  );
}
