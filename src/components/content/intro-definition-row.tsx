import type { ReactNode } from "react";

export function IntroDefinitionRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
      <dt className="font-mono text-sm text-black/45">{label}</dt>
      <dd className="text-sm text-black/80">{children}</dd>
    </div>
  );
}
