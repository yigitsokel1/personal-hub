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
import type { DbWorkItem } from "@/lib/content-source/adapters/work.adapter";
import { toDateOnlyInTurkey } from "@/lib/datetime/published-at";
import {
  serializeCommaList,
  serializeLineList,
  WORK_CONFIDENTIALITY_LEVELS,
  WORK_ENGAGEMENT_TYPES,
} from "@/lib/domain/work/mapper";
import { getFeaturedLimit } from "@/lib/content-policies/featured";

export function WorkForm(props: {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
  status?: string;
  errors: AdminFormErrorState;
  current?: DbWorkItem;
  featuredCount: number;
}) {
  const { current, errors } = props;
  const featuredLimit = getFeaturedLimit("work");
  const featuredLimitReached = props.featuredCount >= featuredLimit;
  const canKeepFeatured = Boolean(current?.featured);
  const willBlockFeaturing = featuredLimitReached && !canKeepFeatured;
  const publishedAtValue = current?.publishedAt ? toDateOnlyInTurkey(new Date(current.publishedAt)) : "";
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
          {featuredLimitReached
            ? "Featured limit reached until an item is unfeatured."
            : "You can feature this item."}
        </p>
        {willBlockFeaturing ? (
          <p className="text-xs text-amber-700">
            Featured capacity is full. Unfeature another work item before marking this as featured.
          </p>
        ) : null}
        <AdminField label="Published date" name="publishedAt" type="date" defaultValue={publishedAtValue} error={errors.fieldErrors.publishedAt} />
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="featured" defaultChecked={Boolean(current?.featured)} />Featured</label>
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="published" defaultChecked={Boolean(current?.published)} />Published</label>
        </div>
        {errors.fieldErrors.featured ? <p className="text-xs text-red-700">{errors.fieldErrors.featured}</p> : null}
      </AdminSection>
      <AdminSection title="Domain-specific" bordered={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Client" name="client" required defaultValue={current?.client} error={errors.fieldErrors.client} />
          <AdminField label="Role" name="role" required defaultValue={current?.role} error={errors.fieldErrors.role} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Engagement type *</span>
            <select name="engagementType" defaultValue={current?.engagementType ?? "contract"} className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35">
              {WORK_ENGAGEMENT_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">Confidentiality</span>
            <select name="confidentialityLevel" defaultValue={current?.confidentialityLevel ?? ""} className="w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35">
              <option value="">none</option>
              {WORK_CONFIDENTIALITY_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
        <AdminField label="Timeline" name="timeline" defaultValue={current?.timeline ?? ""} />
        <AdminField
          label="Live URL"
          name="liveUrl"
          defaultValue={current?.liveUrl ?? ""}
          placeholder="https://example.com"
          description="Optional. Link to the live client-facing result."
          error={errors.fieldErrors.liveUrl}
        />
        <AdminTextarea label="Scope (one line each)" name="scope" defaultValue={serializeLineList(current?.scope ?? [])} error={errors.fieldErrors.scope} />
        <AdminTextarea label="Responsibilities (one line each)" name="responsibilities" defaultValue={serializeLineList(current?.responsibilities ?? [])} error={errors.fieldErrors.responsibilities} />
        <AdminTextarea label="Constraints (one line each)" name="constraints" defaultValue={serializeLineList(current?.constraints ?? [])} />
        <AdminTextarea label="Impact (one line each)" name="impact" defaultValue={serializeLineList(current?.impact ?? [])} />
        <AdminActionBar />
      </AdminSection>
    </AdminForm>
  );
}
