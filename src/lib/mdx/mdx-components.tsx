import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { MdxImage } from "@/components/mdx/mdx-image";
import { isExternalHttpHref, mdxLinkClassName } from "@/lib/mdx/link-styles";

type AnchorProps = ComponentPropsWithoutRef<"a">;

function MDXAnchor({ href, children, ...rest }: AnchorProps) {
  const external = isExternalHttpHref(href);
  return (
    <a
      href={href}
      className={mdxLinkClassName}
      {...rest}
      {...(external
        ? { rel: "noopener noreferrer", target: "_blank" }
        : {})}
    >
      {children}
    </a>
  );
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="mt-10 text-4xl font-semibold tracking-tight" {...props} />
    ),
    h2: (props) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight" {...props} />
    ),
    h3: (props) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight" {...props} />
    ),
    p: (props) => (
      <p className="mt-5 text-base leading-8 text-foreground/88" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mt-5 list-disc space-y-2 pl-6 text-foreground/88 [&_ul]:mt-2 [&_ol]:mt-2"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mt-5 list-decimal space-y-2 pl-6 text-foreground/88 [&_ul]:mt-2 [&_ol]:mt-2"
        {...props}
      />
    ),
    li: (props) => <li className="leading-8" {...props} />,
    a: (props) => <MDXAnchor {...props} />,
    strong: (props) => (
      <strong className="font-semibold text-foreground" {...props} />
    ),
    hr: (props) => (
      <hr className="mt-10 border-0 border-t border-black/10" {...props} />
    ),
    img: (props) => <MdxImage {...props} />,
    table: (props) => (
      <div className="mt-6 overflow-x-auto">
        <table
          className="w-full min-w-[20rem] border-collapse text-left text-sm text-foreground/88"
          {...props}
        />
      </div>
    ),
    thead: (props) => <thead {...props} />,
    tbody: (props) => <tbody {...props} />,
    tr: (props) => <tr {...props} />,
    th: (props) => (
      <th
        className="border border-black/10 bg-black/3 px-3 py-2 font-semibold"
        {...props}
      />
    ),
    td: (props) => (
      <td className="border border-black/10 px-3 py-2 align-top" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-2 pl-4 italic text-black/70"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-sm"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="mt-6 overflow-x-auto rounded-2xl bg-black px-4 py-4 text-white [&_code]:rounded-none [&_code]:bg-transparent [&_code]:px-0 [&_code]:py-0 [&_code]:text-sm [&_code]:text-inherit"
        {...props}
      />
    ),
    ...components,
  };
}
