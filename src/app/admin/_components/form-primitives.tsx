import type { ReactNode } from "react";
import { SubmitButton } from "@/app/admin/_components/submit-button";

const fieldLabelClass = "mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50";
const fieldInputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-black/35";
const fieldTextareaClass =
  "min-h-24 w-full resize-y rounded-md border border-black/15 px-3 py-2 text-sm leading-6 outline-none focus:border-black/35";

export function AdminForm(props: {
  action: (formData: FormData) => Promise<void>;
  children: ReactNode;
  status?: string;
  globalError?: string;
}) {
  return (
    <form action={props.action} className="mt-8 space-y-8">
      {props.status === "error" ? (
        <AdminError>{props.globalError ?? "Error saving. Please review fields."}</AdminError>
      ) : null}
      {props.children}
    </form>
  );
}

export function AdminSection({
  title,
  children,
  bordered = true,
}: {
  title: string;
  children: ReactNode;
  bordered?: boolean;
}) {
  return (
    <section className={`space-y-5 ${bordered ? "border-b border-black/10 pb-8" : ""}`}>
      <h2 className="font-mono text-xs uppercase tracking-[0.15em] text-black/55">{title}</h2>
      {children}
    </section>
  );
}

export function AdminField(props: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  description?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>
        {props.label}
        {props.required ? " *" : ""}
      </span>
      <input
        name={props.name}
        type={props.type}
        min={props.min}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        required={props.required}
        className={fieldInputClass}
      />
      {props.description ? <p className="mt-1 text-xs text-black/45">{props.description}</p> : null}
      {props.error ? <p className="mt-1 text-xs text-red-700">{props.error}</p> : null}
    </label>
  );
}

export function AdminTextarea(props: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>
        {props.label}
        {props.required ? " *" : ""}
      </span>
      <textarea
        name={props.name}
        defaultValue={props.defaultValue}
        placeholder={props.placeholder}
        required={props.required}
        className={`${fieldTextareaClass} ${props.className ?? ""}`}
      />
      {props.description ? <p className="mt-1 text-xs text-black/45">{props.description}</p> : null}
      {props.error ? <p className="mt-1 text-xs text-red-700">{props.error}</p> : null}
    </label>
  );
}

export function AdminTagInput(props: {
  defaultValue?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <AdminField
      label="Tags"
      name="tags"
      defaultValue={props.defaultValue}
      placeholder={props.placeholder ?? "ai, backend, architecture"}
      description="Max 3 tags. Used for grouping and discovery."
      error={props.error}
    />
  );
}

export function AdminError({ children }: { children: ReactNode }) {
  return <p className="text-sm text-red-700">{children}</p>;
}

export function AdminStatus({
  published,
  featured,
  publishedAt,
}: {
  published: boolean;
  featured: boolean;
  publishedAt?: string | null;
}) {
  return (
    <div className="rounded-md border border-black/10 bg-black/2 px-3 py-2 text-xs text-black/65">
      State: {published ? "Published" : "Draft"} | Featured: {featured ? "Yes" : "No"} | Last published:{" "}
      {publishedAt ? new Date(publishedAt).toISOString().slice(0, 16).replace("T", " ") : "-"}
    </div>
  );
}

export function AdminActionBar({
  showDelete,
}: {
  showDelete?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-end gap-3">
      {showDelete}
      <SubmitButton
        name="intent"
        value="preview"
        label="Save and preview"
        pendingLabel="Opening preview..."
        variant="secondary"
        formTarget="_blank"
      />
      <SubmitButton name="intent" value="save" label="Save" pendingLabel="Saving..." />
    </div>
  );
}
