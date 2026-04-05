import type { MDXComponents } from "mdx/types";

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
    a: (props) => (
      <a className="underline underline-offset-4" {...props} />
    ),
    blockquote: (props) => (
      <blockquote
        className="mt-6 border-l-2 pl-4 italic text-black/70"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="mt-6 overflow-x-auto rounded-2xl bg-black px-4 py-4 text-white [&_code]:rounded-none [&_code]:bg-transparent [&_code]:px-0 [&_code]:py-0 [&_code]:text-[0.875em] [&_code]:text-inherit"
        {...props}
      />
    ),
    ...components,
  };
}
