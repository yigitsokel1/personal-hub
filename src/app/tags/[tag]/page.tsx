import type { Metadata } from "next";
import Link from "next/link";
import { CONTENT_PATH_PREFIX } from "@/lib/content/config";
import {
  getAllTags,
  getPublishedEntriesByTag,
  tagFromPathSegment,
  tagPathSegment,
} from "@/lib/content/tags";
import { contentSectionLabel } from "@/lib/seo/build-metadata";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

type TagDetailPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({
    tag: tagPathSegment(tag),
  }));
}

export async function generateMetadata({
  params,
}: TagDetailPageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  const base = getSiteMetadataBase();
  const pathname =
    label !== "" ? `/tags/${tagPathSegment(label)}` : `/tags/${tag}`;
  const canonical =
    base != null ? new URL(pathname, `${base.origin}/`).toString() : undefined;

  const titleSegment = label !== "" ? `${label} — Tags` : "Tag — Tags";

  return {
    title: titleSegment,
    description:
      label !== ""
        ? `Content tagged “${label}”.`
        : "Content for this tag.",
    ...(canonical ? { alternates: { canonical } } : {}),
  };
}

export default async function TagDetailPage({ params }: TagDetailPageProps) {
  const { tag } = await params;
  const label = tagFromPathSegment(tag);
  const entries = label !== "" ? getPublishedEntriesByTag(label) : [];

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <header className="max-w-3xl">
        <p className="text-sm text-black/50">
          <Link
            href="/tags"
            className="underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
          >
            Tags
          </Link>
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          {label !== "" ? (
            <>
              <span className="text-black/55">#</span>
              {label}
            </>
          ) : (
            "Tag"
          )}
        </h1>
      </header>

      {entries.length === 0 ? (
        <div className="mt-12 max-w-3xl space-y-4 border-t border-black/10 pt-10">
          <p className="text-base leading-relaxed text-black/65">
            Nothing published uses this tag right now.
          </p>
          <p>
            <Link
              href="/tags"
              className="text-sm underline decoration-black/25 underline-offset-4 hover:decoration-black/50"
            >
              Back to all tags
            </Link>
          </p>
        </div>
      ) : (
        <ul className="mt-12 max-w-3xl space-y-10 border-t border-black/10 pt-10">
          {entries.map((item) => (
            <li key={item.id}>
              <p className="text-sm text-black/45">
                {contentSectionLabel[item.type]}
              </p>
              <h2 className="mt-1 text-2xl font-semibold leading-snug tracking-tight">
                <Link
                  href={`${CONTENT_PATH_PREFIX[item.type]}/${item.slug}`}
                  className="hover:text-black/70"
                >
                  {item.title}
                </Link>
              </h2>
              <p className="mt-3 text-base leading-relaxed text-black/75">
                {item.summary}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
