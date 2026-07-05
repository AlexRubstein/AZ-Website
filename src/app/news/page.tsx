import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { news } from "@/lib/content";

export default function NewsPage() {
  return (
    <PageShell title="News" description="WordPress posts become structured Sanity news entries with clean metadata, media, SEO, and archive routes.">
      <div className="grid gap-4 md:grid-cols-3">
        {news.map((post) => (
          <Link key={post.slug} href={`/news/${post.slug}`} className="rounded-sm border border-[#d8ded4] bg-[#fffdf7] p-5">
            <p className="font-mono text-sm text-[#b74f32]">{post.date}</p>
            <h2 className="mt-8 text-2xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-[#5f6c63]">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
