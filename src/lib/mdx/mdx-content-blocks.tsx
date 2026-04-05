import type { MDXComponents } from "mdx/types";
import { KeyValueList } from "@/components/mdx/key-value-list";
import { LinkGroup } from "@/components/mdx/link-group";
import { Note } from "@/components/mdx/note";

export const mdxContentBlocks = {
  KeyValueList,
  LinkGroup,
  Note,
} satisfies MDXComponents;
