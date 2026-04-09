"use server";

import { redirect } from "next/navigation";
import {
  countOtherFeaturedLabs,
  createLab,
  deleteLabById,
  getAdminLabById,
  isLabSlugTaken,
  updateLab,
} from "@/lib/content-source/get-labs";
import { toLabInput } from "@/lib/domain/labs/mapper";
import { LAB_STATUSES } from "@/lib/domain/labs/types";
import { validateLabInput } from "@/lib/domain/labs/validator";
import {
  enforceFeaturedLimit,
  enforcePublishEligibility,
  redirectWithErrors,
  validateMdxBody,
} from "@/lib/admin/content-mutations";
import { isNextRedirectError } from "@/lib/admin/action-errors";
import { logMutationError, logMutationEvent } from "@/lib/admin/mutation-logging";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function createLabAction(formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const validated = validateLabInput(
    toLabInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      status: String(formData.get("status") ?? "idea") as (typeof LAB_STATUSES)[number],
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );
  if (!validated.success) redirectWithErrors("/admin/labs/new", validated.errors);
  enforcePublishEligibility(publishRequested, "/admin/labs/new", validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "labs", action: "create", reason: "mdx_error", details: mdxError });
    redirectWithErrors("/admin/labs/new", { body: mdxError });
  }
  if (await isLabSlugTaken(validated.value.slug)) redirectWithErrors("/admin/labs/new", { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedLabs(),
    domain: "labs",
    basePath: "/admin/labs/new",
  });
  try {
    const saved = await createLab(validated.value);
    logMutationEvent({ domain: "labs", action: "create", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "labs",
      slug: saved.slug,
      tags: saved.tags,
      published: saved.published,
      featured: Boolean(saved.featured),
    });
    if (isPreviewIntent) redirect(`/preview/labs/${saved.slug}`);
    redirect("/admin/labs?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "labs", action: "create", reason: "mutation_error", details: error });
    redirectWithErrors("/admin/labs/new", { _global: "Failed to save lab item." });
  }
}

export async function updateLabAction(id: string, formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const basePath = `/admin/labs/${id}`;
  const validated = validateLabInput(
    toLabInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      status: String(formData.get("status") ?? "idea") as (typeof LAB_STATUSES)[number],
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );
  if (!validated.success) redirectWithErrors(basePath, validated.errors);
  enforcePublishEligibility(publishRequested, basePath, validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "labs", action: "update", reason: "mdx_error", details: mdxError });
    redirectWithErrors(basePath, { body: mdxError });
  }
  if (await isLabSlugTaken(validated.value.slug, id)) redirectWithErrors(basePath, { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedLabs(id),
    domain: "labs",
    basePath,
  });
  const current = await getAdminLabById(id);
  if (!current) redirect("/admin/labs?status=missing");
  try {
    const saved = await updateLab(id, validated.value);
    logMutationEvent({ domain: "labs", action: "update", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "labs",
      slug: saved.slug,
      previousSlug: current.slug,
      tags: saved.tags,
      previousTags: current.tags ?? [],
      published: saved.published,
      previousPublished: current.published,
      featured: Boolean(saved.featured),
      previousFeatured: Boolean(current.featured),
    });
    if (isPreviewIntent) redirect(`/preview/labs/${saved.slug}`);
    redirect("/admin/labs?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "labs", action: "update", reason: "mutation_error", details: error });
    redirectWithErrors(basePath, { _global: "Failed to update lab item." });
  }
}

export async function deleteLabAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/labs?status=delete_error");
  }

  const result = await deleteLabById(id);
  if (!result.ok) {
    redirect("/admin/labs?status=delete_missing");
  }
  logMutationEvent({ domain: "labs", action: "delete", slug: result.slug ?? "" });

  revalidateContentSurfaces({
    domain: "labs",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/labs?status=deleted");
}
