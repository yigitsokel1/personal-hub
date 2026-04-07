import type { ReactNode } from "react";

type ContentDetailMainProps = {
  children: ReactNode;
};

/** Shared shell for project / work / writing / lab detail routes. */
export function ContentDetailMain({ children }: ContentDetailMainProps) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20 lg:py-24">
      {children}
    </main>
  );
}
