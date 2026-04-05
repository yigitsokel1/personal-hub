import { IntroDefinitionRow } from "@/components/content/intro-definition-row";

export type KeyValueRow = { label: string; value: string };

/**
 * MDX: repeating label/value rows aligned with project/work intro metadata styling.
 */
export function KeyValueList({ rows }: { rows: KeyValueRow[] }) {
  return (
    <dl className="mt-8 space-y-4">
      {rows.map((row, i) => (
        <IntroDefinitionRow key={`${row.label}-${i}`} label={row.label}>
          {row.value}
        </IntroDefinitionRow>
      ))}
    </dl>
  );
}
