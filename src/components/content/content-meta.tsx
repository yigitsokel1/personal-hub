type ContentMetaItem = {
  label: string;
  type: "text";
};

type ContentMetaProps = {
  items: ContentMetaItem[];
};

export function ContentMeta({ items }: ContentMetaProps) {
  if (items.length === 0) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-2 font-mono text-sm leading-relaxed text-black/45">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {item.label}
        </span>
      ))}
    </p>
  );
}
