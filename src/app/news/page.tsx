import type { Metadata } from "next";
import { NewsCard } from "@/components/NewsCard";
import { PageShell } from "@/components/PageShell";
import { formatNewsDate, getNewsPosts } from "@/lib/news";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "News",
  description:
    "Read Arizona Alpine Trail news, event updates, trail-planning announcements, and community stories.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "Arizona Alpine Trail News",
    description:
      "News, event updates, trail-planning announcements, and community stories from Arizona Alpine Trail.",
    url: "/news",
  },
};

export default async function NewsPage() {
  const posts = await getNewsPosts();

  return (
    <PageShell title="News">
      <div className="grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
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
    </PageShell>
  );
}
