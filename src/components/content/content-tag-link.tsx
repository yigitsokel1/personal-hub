import Link from "next/link";
import { tagPathSegment } from "@/lib/content/tags";
import { tagLinkClassName } from "@/lib/ui/link-tokens";

type ContentTagLinkProps = {
  tag: string;
};

export function ContentTagLink({ tag }: ContentTagLinkProps) {
  return (
    <Link
      href={`/tags/${tagPathSegment(tag)}`}
      className={tagLinkClassName}
    >
      #{tag}
    </Link>
  );
}
