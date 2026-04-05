import type { ReactNode } from "react";

type NoteProps = {
  children: ReactNode;
};

/**
 * MDX: aside / editorial note — distinct from blockquote (pull-quote) styling.
 */
export function Note({ children }: NoteProps) {
  return (
    <aside className="mt-6 border-l-2 border-black/20 bg-black/[0.02] py-2 pl-4 text-sm leading-relaxed text-black/75 [&_p]:mt-0 [&_p+p]:mt-3">
      {children}
    </aside>
  );
}
