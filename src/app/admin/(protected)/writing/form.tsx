import {
  AdminActionBar,
  AdminField,
  AdminForm,
  AdminSection,
  AdminStatus,
  AdminTagInput,
  AdminTextarea,
} from "@/app/admin/_components/form-primitives";
import type { AdminFormErrorState } from "@/lib/admin/form-errors";
import type { DbWritingItem } from "@/lib/content-source/adapters/writing.adapter";
import { toDateOnlyInTurkey } from "@/lib/datetime/published-at";
import { serializeTags } from "@/lib/domain/writing/mapper";
import { getFeaturedLimit } from "@/lib/content-policies/featured";

type WritingFormProps = {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
  status?: string;
  errors: AdminFormErrorState;
  current?: DbWritingItem;
  featuredCount: number;
};

export function WritingForm({ mode, action, status, errors, current, featuredCount }: WritingFormProps) {
  const featuredLimit = getFeaturedLimit("writing");
  const featuredLimitReached = featuredCount >= featuredLimit;
  const canKeepFeatured = Boolean(current?.featured);
  const willBlockFeaturing = featuredLimitReached && !canKeepFeatured;
  const publishedAtValue = current?.publishedAt ? toDateOnlyInTurkey(new Date(current.publishedAt)) : "";

  return (
    <AdminForm action={action} status={status} globalError={errors.globalError}>
      {status === "saved" ? <p className="text-sm text-green-700">Saved successfully.</p> : null}
      <AdminSection title="Content">
        <AdminField label="Title" name="title" required defaultValue={current?.title} error={errors.fieldErrors.title} />
        <AdminField
          label="Slug"
          name="slug"
          required
          defaultValue={current?.slug}
          description={mode === "edit" ? "If you change slug, old preview/public URLs will no longer resolve." : "Used in URL. Auto-generated from title but editable."}
          error={errors.fieldErrors.slug}
        />
        <AdminTextarea label="Summary" name="summary" required defaultValue={current?.summary} error={errors.fieldErrors.summary} className="min-h-32" />
        <AdminTextarea label="Body" name="body" required defaultValue={current?.body} error={errors.fieldErrors.body} className="min-h-80 font-mono leading-7" />
        <AdminTagInput defaultValue={serializeTags(current?.tags ?? [])} error={errors.fieldErrors.tags} />
      </AdminSection>

      <AdminSection title="Publishing">
        <AdminStatus published={Boolean(current?.published)} featured={Boolean(current?.featured)} publishedAt={current?.publishedAt ?? null} />
        <p className="text-xs text-black/55">
          Featured usage: {featuredCount}/{featuredLimit}.{" "}
          {featuredLimitReached ? "Featured limit reached until an item is unfeatured." : "You can feature this item."}
        </p>
        {willBlockFeaturing ? (
          <p className="text-xs text-amber-700">
            Featured capacity is full. Unfeature another writing item before marking this as featured.
          </p>
        ) : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField
            label="Reading time (min)"
            name="readingTime"
            type="number"
            min={1}
            defaultValue={current?.readingTime ? String(current.readingTime) : ""}
            error={errors.fieldErrors.readingTime}
          />
          <AdminField
            label="Published date"
            name="publishedAt"
            type="date"
            defaultValue={publishedAtValue}
            description="Used for ordering by day on the public site."
            error={errors.fieldErrors.publishedAt}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-black/70">
            <input type="checkbox" name="featured" defaultChecked={Boolean(current?.featured)} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-black/70">
            <input type="checkbox" name="published" defaultChecked={Boolean(current?.published)} />
            Published
          </label>
        </div>
        {errors.fieldErrors.featured ? <p className="text-xs text-red-700">{errors.fieldErrors.featured}</p> : null}
      </AdminSection>

      <AdminSection title="Domain-specific" bordered={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Category" name="category" defaultValue={current?.category ?? ""} />
          <AdminField label="Series" name="series" defaultValue={current?.series ?? ""} />
        </div>
        <AdminActionBar />
      </AdminSection>
    </AdminForm>
  );
}
