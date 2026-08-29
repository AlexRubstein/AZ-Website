import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type NewsCardProps = {
  href: string;
  title: string;
  dateLabel?: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
};

export function NewsCard({ href, title, dateLabel, excerpt, image, imageAlt, imageFit = "cover" }: NewsCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[8px] border border-[#d8ded4] bg-[#f8f4e8] p-3"
    >
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-[4px] bg-[#173d2b] ${imageFit === "contain" ? "bg-[#fffdf7] p-8" : ""}`}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className={`transition duration-500 motion-safe:group-hover:scale-[1.03] ${imageFit === "contain" ? "object-contain" : "object-cover"}`}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        {dateLabel ? <p className="font-mono text-xs uppercase tracking-wide text-[#5f6c63]">{dateLabel}</p> : null}
        <h3 className="mt-2 text-xl font-semibold leading-snug text-[#13221a]">{title}</h3>
        {excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f6c63]">{excerpt}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#173d2b] transition group-hover:text-[#b74f32]">
          Read article
          <ArrowRight
            size={14}
            aria-hidden="true"
            className="transition duration-300 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
