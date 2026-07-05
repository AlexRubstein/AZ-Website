import { notFound } from "next/navigation";
import { PageShell } from "@/components/PageShell";
import { news } from "@/lib/content";

export function generateStaticParams() {
  return news.map((post) => ({ slug: post.slug }));
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = news.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <PageShell title={post.title} description={post.excerpt}>
      <article className="prose prose-lg max-w-3xl text-[#13221a]">
        <p className="font-mono text-sm text-[#b74f32]">{post.date}</p>
        <p>
          This page is wired as a Sanity-backed news template. The migration script should import
          WordPress post body, media, publication date, excerpt, and legacy slug.
        </p>
      </article>
    </PageShell>
  );
}
