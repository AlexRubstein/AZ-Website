import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { NewsCard } from "@/components/NewsCard";
import { formatNewsDate, type NewsPost } from "@/lib/news";

type NewsPreviewProps = {
  title?: string;
  posts?: NewsPost[];
};

export function NewsPreview({ title = "Latest News", posts = [] }: NewsPreviewProps) {
  if (!posts.length) return null;

  return (
    <section id="news" className="bg-[#fffdf7] px-5 py-12 text-[#13221a] sm:px-8 lg:py-14">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
          <Link
            href="/news"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.14em] text-[#173d2b] transition hover:text-[#b74f32]"
          >
            View all posts
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <NewsCard
              key={post.slug}
              href={`/news/${post.slug}`}
              title={post.title}
              dateLabel={formatNewsDate(post.date)}
              excerpt={post.excerpt}
              image={post.heroImage}
              imageAlt={post.heroImageAlt}
              imageFit={post.heroImageContain ? "contain" : "cover"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
