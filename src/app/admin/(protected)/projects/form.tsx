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
import type { DbProjectItem } from "@/lib/content-source/adapters/project.adapter";
import { serializeCommaList, serializeLineList } from "@/lib/domain/projects/mapper";
import { getFeaturedLimit } from "@/lib/content-policies/featured";

export function ProjectsForm(props: {
  mode: "create" | "edit";
  action: (formData: FormData) => Promise<void>;
  status?: string;
  errors: AdminFormErrorState;
  current?: DbProjectItem;
  featuredCount: number;
}) {
  const { current, errors } = props;
  const featuredLimit = getFeaturedLimit("projects");
  const publishedAtValue = current?.publishedAt ? new Date(current.publishedAt).toISOString().slice(0, 16) : "";

  return (
    <AdminForm action={props.action} status={props.status} globalError={errors.globalError}>
      <AdminSection title="Content">
        <AdminField label="Title" name="title" required defaultValue={current?.title} error={errors.fieldErrors.title} />
        <AdminField label="Slug" name="slug" required defaultValue={current?.slug} error={errors.fieldErrors.slug} />
        <AdminTextarea label="Summary" name="summary" required defaultValue={current?.summary} error={errors.fieldErrors.summary} />
        <AdminTextarea label="Body" name="body" required defaultValue={current?.body} error={errors.fieldErrors.body} className="min-h-80 font-mono text-xs" />
        <AdminTagInput defaultValue={serializeCommaList(current?.tags ?? [])} placeholder="system-design, backend, ai" error={errors.fieldErrors.tags} />
      </AdminSection>

      <AdminSection title="Publishing">
        <AdminStatus published={Boolean(current?.published)} featured={Boolean(current?.featured)} publishedAt={current?.publishedAt ?? null} />
        <p className="text-xs text-black/55">
          Featured usage: {props.featuredCount}/{featuredLimit}.{" "}
          {props.featuredCount >= featuredLimit
            ? "Featured limit reached until an item is unfeatured."
            : "You can feature this item."}
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminField label="Published at" name="publishedAt" type="datetime-local" defaultValue={publishedAtValue} error={errors.fieldErrors.publishedAt} />
          <AdminField label="Role" name="role" required defaultValue={current?.role} error={errors.fieldErrors.role} />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="featured" defaultChecked={Boolean(current?.featured)} />Featured</label>
          <label className="inline-flex items-center gap-2 text-sm text-black/70"><input type="checkbox" name="published" defaultChecked={Boolean(current?.published)} />Published</label>
        </div>
      </AdminSection>

      <AdminSection title="Domain-specific" bordered={false}>
        <AdminField label="Platform" name="platform" defaultValue={current?.platform ?? ""} />
        <AdminField label="Stack (comma)" name="stack" required defaultValue={serializeCommaList(current?.stack ?? [])} error={errors.fieldErrors.stack} />
        <AdminTextarea label="Problem" name="problem" required defaultValue={current?.problem} error={errors.fieldErrors.problem} />
        <AdminTextarea label="Solution" name="solution" required defaultValue={current?.solution} error={errors.fieldErrors.solution} />
        <div className="grid gap-5 sm:grid-cols-2">
          <AdminTextarea label="Architecture highlights (one line each)" name="architectureHighlights" defaultValue={serializeLineList(current?.architectureHighlights ?? [])} />
          <AdminTextarea label="Decisions (one line each)" name="decisions" defaultValue={serializeLineList(current?.decisions ?? [])} />
        </div>
        <AdminTextarea label="Outcomes (one line each)" name="outcomes" defaultValue={serializeLineList(current?.outcomes ?? [])} />
        <div className="grid gap-5 sm:grid-cols-3">
          <AdminField label="Repo URL" name="repoUrl" defaultValue={current?.repoUrl ?? ""} error={errors.fieldErrors.repoUrl} />
          <AdminField label="Live URL" name="liveUrl" defaultValue={current?.liveUrl ?? ""} error={errors.fieldErrors.liveUrl} />
          <AdminField label="Timeline" name="timeline" defaultValue={current?.timeline ?? ""} />
        </div>
        <AdminActionBar />
      </AdminSection>
    </AdminForm>
  );
}
