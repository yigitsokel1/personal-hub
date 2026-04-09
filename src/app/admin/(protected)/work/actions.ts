"use server";

import { redirect } from "next/navigation";
import {
  countOtherFeaturedWork,
  createWork,
  deleteWorkById,
  getAdminWorkById,
  isWorkSlugTaken,
  updateWork,
} from "@/lib/content-source/get-work";
import {
  toWorkInput,
  WORK_CONFIDENTIALITY_LEVELS,
  WORK_ENGAGEMENT_TYPES,
} from "@/lib/domain/work/mapper";
import { validateWorkInput } from "@/lib/domain/work/validator";
import {
  enforceFeaturedLimit,
  enforcePublishEligibility,
  redirectWithErrors,
  validateMdxBody,
} from "@/lib/admin/content-mutations";
import { isNextRedirectError } from "@/lib/admin/action-errors";
import { logMutationError, logMutationEvent } from "@/lib/admin/mutation-logging";
import {
  cleanupSlugRedirectsForDeletedSlug,
  recordSlugRedirect,
} from "@/lib/content-source/slug-redirects";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function createWorkAction(formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";

  const validated = validateWorkInput(
    toWorkInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
      client: String(formData.get("client") ?? ""),
      engagementType: String(formData.get("engagementType") ?? "") as (typeof WORK_ENGAGEMENT_TYPES)[number],
      role: String(formData.get("role") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      confidentialityLevel: String(formData.get("confidentialityLevel") ?? "") as
        | (typeof WORK_CONFIDENTIALITY_LEVELS)[number]
        | "",
      scopeRaw: String(formData.get("scope") ?? ""),
      responsibilitiesRaw: String(formData.get("responsibilities") ?? ""),
      constraintsRaw: String(formData.get("constraints") ?? ""),
      impactRaw: String(formData.get("impact") ?? ""),
    })
  );

  if (!validated.success) redirectWithErrors("/admin/work/new", validated.errors);
  enforcePublishEligibility(publishRequested, "/admin/work/new", validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "work", action: "create", reason: "mdx_error", details: mdxError });
    redirectWithErrors("/admin/work/new", { body: mdxError });
  }
  if (await isWorkSlugTaken(validated.value.slug)) redirectWithErrors("/admin/work/new", { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedWork(),
    domain: "work",
    basePath: "/admin/work/new",
  });

  try {
    const saved = await createWork(validated.value);
    logMutationEvent({ domain: "work", action: "create", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "work",
      slug: saved.slug,
      tags: saved.tags,
      published: saved.published,
      featured: Boolean(saved.featured),
    });
    if (isPreviewIntent) redirect(`/preview/work/${saved.slug}`);
    redirect("/admin/work?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "work", action: "create", reason: "mutation_error", details: error });
    redirectWithErrors("/admin/work/new", { _global: "Failed to save work item." });
  }
}

export async function updateWorkAction(id: string, formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const basePath = `/admin/work/${id}`;

  const validated = validateWorkInput(
    toWorkInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
      client: String(formData.get("client") ?? ""),
      engagementType: String(formData.get("engagementType") ?? "") as (typeof WORK_ENGAGEMENT_TYPES)[number],
      role: String(formData.get("role") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      confidentialityLevel: String(formData.get("confidentialityLevel") ?? "") as
        | (typeof WORK_CONFIDENTIALITY_LEVELS)[number]
        | "",
      scopeRaw: String(formData.get("scope") ?? ""),
      responsibilitiesRaw: String(formData.get("responsibilities") ?? ""),
      constraintsRaw: String(formData.get("constraints") ?? ""),
      impactRaw: String(formData.get("impact") ?? ""),
    })
  );

  if (!validated.success) redirectWithErrors(basePath, validated.errors);
  enforcePublishEligibility(publishRequested, basePath, validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "work", action: "update", reason: "mdx_error", details: mdxError });
    redirectWithErrors(basePath, { body: mdxError });
  }
  if (await isWorkSlugTaken(validated.value.slug, id)) redirectWithErrors(basePath, { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedWork(id),
    domain: "work",
    basePath,
  });

  const current = await getAdminWorkById(id);
  if (!current) redirect("/admin/work?status=missing");

  try {
    const saved = await updateWork(id, validated.value);
    await recordSlugRedirect("work", current.slug, saved.slug);
    logMutationEvent({ domain: "work", action: "update", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "work",
      slug: saved.slug,
      previousSlug: current.slug,
      tags: saved.tags,
      previousTags: current.tags ?? [],
      published: saved.published,
      previousPublished: current.published,
      featured: Boolean(saved.featured),
      previousFeatured: Boolean(current.featured),
    });
    if (isPreviewIntent) redirect(`/preview/work/${saved.slug}`);
    redirect("/admin/work?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "work", action: "update", reason: "mutation_error", details: error });
    redirectWithErrors(basePath, { _global: "Failed to update work item." });
  }
}

export async function deleteWorkAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/work?status=delete_error");
  }

  try {
    const result = await deleteWorkById(id);
    if (!result.ok) {
      redirect("/admin/work?status=delete_missing");
    }
    if (result.slug) {
      await cleanupSlugRedirectsForDeletedSlug("work", result.slug);
    }
    logMutationEvent({ domain: "work", action: "delete", slug: result.slug ?? "" });

    revalidateContentSurfaces({
      domain: "work",
      previousSlug: result.slug,
      previousTags: result.tags,
      previousPublished: result.published,
      previousFeatured: result.featured,
    });
    redirect("/admin/work?status=deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "work", action: "delete", reason: "mutation_error", details: error });
    redirect("/admin/work?status=delete_error");
  }
}
