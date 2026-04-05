import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/lib/mdx/mdx-components";
import { mdxContentBlocks } from "@/lib/mdx/mdx-content-blocks";

type ContentBodyProps = {
  body: string;
};

/**
 * Vertical rhythm: intro → this block uses `mt-16` below the header; first MDX
 * child top margin is zeroed. Foot sections (related, prev/next) use `mt-16
 * border-t pt-10` to match.
 */
export function ContentBody({ body }: ContentBodyProps) {
  return (
    <div className="mt-16 max-w-3xl [&>*:first-child]:mt-0">
      <MDXRemote
        source={body}
        components={useMDXComponents(mdxContentBlocks)}
      />
    </div>
  );
}
