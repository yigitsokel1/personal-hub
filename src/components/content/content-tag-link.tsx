import Link from "next/link";
import { formatTagDisplay } from "@/lib/content-intelligence/tag-grouping";
import { tagPathSegment } from "@/lib/content/tags";
import { tagLinkClassName } from "@/lib/ui/link-tokens";

type ContentTagLinkProps = {
  tag: string;
};

export function ContentTagLink({ tag }: ContentTagLinkProps) {
  const displayTag = formatTagDisplay(tag);
  return (
    <Link
      href={`/tags/${tagPathSegment(tag)}`}
      className={tagLinkClassName}
    >
      #{displayTag}
    </Link>
  );
}
