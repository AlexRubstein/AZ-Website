import Link from "next/link";

const footerLinks = [
  { label: "Trail", href: "/trail" },
  { label: "Map", href: "/#trail-map" },
  { label: "Downloads", href: "/#downloads" },
  { label: "Itineraries", href: "/#itineraries" },
  { label: "FAQ", href: "/faq" },
];

export function Footer() {
  return (
    <footer className="bg-[#08130d] text-white">
      <div className="mx-auto grid max-w-[1220px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-semibold leading-none">Arizona Alpine Trail</p>
        </div>
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#e5b96f]">Explore</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-white/72 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-white/52">
        Arizona Alpine Trail, Inc. 501(c)(3).
      </div>
    </footer>
  );
}
