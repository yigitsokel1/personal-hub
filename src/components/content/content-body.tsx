import { MDXRemote } from "next-mdx-remote/rsc";
import { useMDXComponents } from "@/lib/mdx/mdx-components";

type ContentBodyProps = {
  body: string;
};

export function ContentBody({ body }: ContentBodyProps) {
  return (
    <div className="mt-14 max-w-3xl">
      <MDXRemote source={body} components={useMDXComponents({})} />
    </div>
  );
}
