import { MDXRemote } from "next-mdx-remote/rsc";
import { serialize } from "next-mdx-remote/serialize";
import { mdxContentBlocks } from "@/lib/mdx/mdx-content-blocks";
import { useMDXComponents } from "@/lib/mdx/mdx-components";

type ContentBodyProps = {
  body: string;
  context?: {
    domain: "writing" | "projects" | "work" | "labs";
    slug: string;
    isPreview?: boolean;
  };
};

/**
 * Vertical rhythm: intro → this block uses `mt-16` below the header; first MDX
 * child top margin is zeroed. Foot sections (related, prev/next) use `mt-16
 * border-t pt-10` to match.
 */
export async function ContentBody({ body, context }: ContentBodyProps) {
  const mdxComponents = useMDXComponents(mdxContentBlocks);

  try {
    await serialize(body);
  } catch (error) {
    console.error("MDX render failed", {
      error,
      domain: context?.domain,
      slug: context?.slug,
      preview: Boolean(context?.isPreview),
    });

    return (
      <div className="mt-16 max-w-176 rounded-md border border-amber-800/20 bg-amber-50 px-4 py-3 text-sm text-amber-900/90 sm:mt-18">
        {context?.isPreview
          ? "This preview cannot render because the body contains invalid MDX. Fix the body and try preview again."
          : "This content body is temporarily unavailable due to a rendering issue."}
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-176 [&>*:first-child]:mt-0 sm:mt-18">
      <MDXRemote source={body} components={mdxComponents} />
    </div>
  );
}
