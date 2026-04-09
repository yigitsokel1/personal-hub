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
import type { DbLabItem } from "@/lib/content-source/adapters/lab.adapter";
import { serializeCommaList } from "@/lib/domain/labs/mapper";
import { LAB_STATUSES } from "@/lib/domain/labs/types";
import { getFeaturedLimit } from "@/lib/content-policies/featured";

export function LabsForm(props: {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
  status?: string;
  errors: AdminFormErrorState;
  current?: DbLabItem;
  featuredCount: number;
}) {
  const { current, errors } = props;
  const featuredLimit = getFeaturedLimit("labs");
  const publishedAtValue = current?.publishedAt ? new Date(current.publishedAt).toISOString().slice(0, 16) : "";

  return (
    <AdminForm action={props.action} status={props.status} globalError={errors.globalError}>
      <AdminSection title="Content">
        <AdminField label="Title" name="title" required defaultValue={current?.title} error={errors.fieldErrors.title} />
        <AdminField label="Slug" name="slug" required defaultValue={current?.slug} error={errors.fieldErrors.slug} />
        <AdminTextarea label="Summary" name="summary" required defaultValue={current?.summary} error={errors.fieldErrors.summary} className="min-h-32" />
        <AdminTextarea label="Body" name="body" required defaultValue={current?.body} error={errors.fieldErrors.body} className="min-h-80 font-mono leading-7" />
        <AdminTagInput defaultValue={serializeCommaList(current?.tags ?? [])} error={errors.fieldErrors.tags} />
      </AdminSection>
      <AdminSection title="Publishing">
        <AdminStatus published={Boolean(current?.published)} featured={Boolean(current?.featured)} publishedAt={current?.publishedAt ?? null} />
        <p className="text-xs text-black/55">
          Featured usage: {props.featuredCount}/{featuredLimit}.{" "}
          {props.featuredCount >= featuredLimit
            ? "Featured limit reached until an item is unfeatured."
            : "You can feature this item."}
        </p>
        <AdminField label="Published at" name="publishedAt" type="datetime-local" defaultValue={publishedAtValue} error={errors.fieldErrors.publishedAt} />
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="featured" defaultChecked={Boolean(current?.featured)} />Featured</label>
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="published" defaultChecked={Boolean(current?.published)} />Published</label>
        </div>
      </AdminSection>
      <AdminSection title="Domain-specific" bordered={false}>
        <label className="block max-w-sm">
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Status *</span>
          <select name="status" defaultValue={current?.status ?? "idea"} className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35">
            {LAB_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          {errors.fieldErrors.status ? <p className="mt-1 text-xs text-red-700">{errors.fieldErrors.status}</p> : null}
        </label>
        <AdminActionBar />
      </AdminSection>
    </AdminForm>
  );
}
