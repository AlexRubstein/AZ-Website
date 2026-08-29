import { sanityClient } from "@/sanity/lib/client";
import { newsPostBySlugQuery, newsPostsQuery } from "@/sanity/lib/queries";
import { news as localNews, type NewsBodyBlock, type NewsPost as LocalNewsPost } from "@/lib/content";

export { formatNewsDate } from "@/lib/content";

export type NewsSource = {
  label?: string;
  url?: string;
  reporter?: string;
  photoCredit?: string;
};

type PortableTextSpan = { _type: "span"; text?: string };
type PortableTextBlock = { _type: string; children?: PortableTextSpan[] };
export type NewsBody = NewsBodyBlock[] | PortableTextBlock[];

export type NewsPost = {
  title: string;
  slug: string;
  date: string;
  category?: string;
  excerpt?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageContain?: boolean;
  body?: NewsBody;
  source?: NewsSource;
  seo?: { title?: string; description?: string; image?: string };
};

const fetchOptions =
  process.env.NODE_ENV === "development" ? { cache: "no-store" as const } : { next: { revalidate: 30 } };

function fromLocal(post: LocalNewsPost): NewsPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    category: post.category,
    excerpt: post.excerpt,
    heroImage: post.heroImage,
    heroImageAlt: post.heroImageAlt,
    heroImageContain: post.heroImageFit === "contain",
    body: post.body,
    source: post.source,
  };
}

function fromSanity(doc: {
  title: string;
  slug: string;
  category?: string;
  excerpt?: string;
  publishedAt?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageContain?: boolean;
  body?: PortableTextBlock[];
  source?: NewsSource;
  seo?: { title?: string; description?: string; image?: string };
}): NewsPost {
  return {
    title: doc.title,
    slug: doc.slug,
    date: (doc.publishedAt || "").slice(0, 10),
    category: doc.category,
    excerpt: doc.excerpt,
    heroImage: doc.heroImage,
    heroImageAlt: doc.heroImageAlt,
    heroImageContain: doc.heroImageContain,
    body: doc.body,
    source: doc.source,
    seo: doc.seo,
  };
}

function localFallbackList(): NewsPost[] {
  return [...localNews].sort((a, b) => (a.date < b.date ? 1 : -1)).map(fromLocal);
}

export async function getNewsPosts(): Promise<NewsPost[]> {
  try {
    const docs = await sanityClient.fetch(newsPostsQuery, {}, fetchOptions);
    if (docs?.length) return docs.map(fromSanity);
  } catch {
    // Sanity unreachable — fall through to local fallback content below.
  }
  return localFallbackList();
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const doc = await sanityClient.fetch(newsPostBySlugQuery, { slug }, fetchOptions);
    if (doc) return fromSanity(doc);
  } catch {
    // Sanity unreachable — fall through to local fallback content below.
  }
  const local = localNews.find((post) => post.slug === slug);
  return local ? fromLocal(local) : null;
}

export function isPortableTextBody(body?: NewsBody): body is PortableTextBlock[] {
  return Boolean(body?.length && (body[0] as PortableTextBlock)._type === "block");
}

export type { NewsBodyBlock } from "@/lib/content";

export function estimateReadMinutes(body?: NewsBody): number | null {
  if (!body?.length) return null;

  const words = isPortableTextBody(body)
    ? body.reduce((sum, block) => {
        const text = (block.children || []).map((span) => span.text || "").join(" ");
        return sum + text.trim().split(/\s+/).filter(Boolean).length;
      }, 0)
    : (body as NewsBodyBlock[]).reduce((sum, block) => sum + block.text.trim().split(/\s+/).length, 0);

  return Math.max(1, Math.round(words / 200));
}
