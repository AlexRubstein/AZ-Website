import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { isPortableTextBody, type NewsBody as NewsBodyValue, type NewsBodyBlock } from "@/lib/news";

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold text-[#13221a]">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-[#13221a]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#b74f32] pl-5 text-xl italic text-[#173d2b]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-[#b74f32] underline"
      >
        {children}
      </a>
    ),
  },
};

function LocalBody({ body }: { body: NewsBodyBlock[] }) {
  return (
    <>
      {body.map((block, index) => {
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="border-l-4 border-[#b74f32] pl-5 text-xl italic text-[#173d2b]">
              &ldquo;{block.text}&rdquo;
            </blockquote>
          );
        }

        if (block.type === "link") {
          return (
            <p key={index}>
              <a
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#b74f32] underline"
              >
                {block.text}
              </a>
            </p>
          );
        }

        return <p key={index}>{block.text}</p>;
      })}
    </>
  );
}

export function NewsBody({ body }: { body?: NewsBodyValue }) {
  if (!body?.length) {
    return <p className="text-[#5f6c63]">The full story for this post hasn&apos;t been added yet.</p>;
  }

  if (isPortableTextBody(body)) {
    return <PortableText value={body} components={portableTextComponents} />;
  }

  return <LocalBody body={body as NewsBodyBlock[]} />;
}
