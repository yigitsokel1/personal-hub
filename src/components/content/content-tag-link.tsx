import Link from "next/link";
import { tagPathSegment } from "@/lib/content/tags";

type ContentTagLinkProps = {
  tag: string;
};

export function ContentTagLink({ tag }: ContentTagLinkProps) {
  return (
    <Link
      href={`/tags/${tagPathSegment(tag)}`}
      className="text-sm text-black/55 underline decoration-transparent underline-offset-4 hover:text-black/75 hover:decoration-black/30"
    >
      #{tag}
    </Link>
  );
}
