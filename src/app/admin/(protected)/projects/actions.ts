"use server";

import { redirect } from "next/navigation";
import {
  countOtherFeaturedProjects,
  createProject,
  deleteProjectById,
  getAdminProjectById,
  isProjectSlugTaken,
  updateProject,
} from "@/lib/content-source/get-projects";
import { toProjectInput } from "@/lib/domain/projects/mapper";
import { validateProjectInput } from "@/lib/domain/projects/validator";
import {
  enforceFeaturedLimit,
  enforcePublishEligibility,
  redirectWithErrors,
  validateMdxBody,
} from "@/lib/admin/content-mutations";
import { isNextRedirectError } from "@/lib/admin/action-errors";
import { logMutationError, logMutationEvent } from "@/lib/admin/mutation-logging";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function createProjectAction(formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const validated = validateProjectInput(
    toProjectInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
      role: String(formData.get("role") ?? ""),
      stackRaw: String(formData.get("stack") ?? ""),
      platform: String(formData.get("platform") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      solution: String(formData.get("solution") ?? ""),
      architectureHighlightsRaw: String(formData.get("architectureHighlights") ?? ""),
      decisionsRaw: String(formData.get("decisions") ?? ""),
      outcomesRaw: String(formData.get("outcomes") ?? ""),
      repoUrl: String(formData.get("repoUrl") ?? ""),
      liveUrl: String(formData.get("liveUrl") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
    })
  );
  if (!validated.success) redirectWithErrors("/admin/projects/new", validated.errors);
  enforcePublishEligibility(publishRequested, "/admin/projects/new", validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "projects", action: "create", reason: "mdx_error", details: mdxError });
    redirectWithErrors("/admin/projects/new", { body: mdxError });
  }
  if (await isProjectSlugTaken(validated.value.slug)) redirectWithErrors("/admin/projects/new", { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedProjects(),
    domain: "projects",
    basePath: "/admin/projects/new",
  });
  try {
    const saved = await createProject(validated.value);
    logMutationEvent({ domain: "projects", action: "create", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "projects",
      slug: saved.slug,
      tags: saved.tags,
      published: saved.published,
      featured: Boolean(saved.featured),
    });
    if (isPreviewIntent) redirect(`/preview/projects/${saved.slug}`);
    redirect("/admin/projects?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "projects", action: "create", reason: "mutation_error", details: error });
    redirectWithErrors("/admin/projects/new", { _global: "Failed to save project item." });
  }
}

export async function updateProjectAction(id: string, formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const basePath = `/admin/projects/${id}`;
  const validated = validateProjectInput(
    toProjectInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      publishedAt: String(formData.get("publishedAt") ?? ""),
      role: String(formData.get("role") ?? ""),
      stackRaw: String(formData.get("stack") ?? ""),
      platform: String(formData.get("platform") ?? ""),
      problem: String(formData.get("problem") ?? ""),
      solution: String(formData.get("solution") ?? ""),
      architectureHighlightsRaw: String(formData.get("architectureHighlights") ?? ""),
      decisionsRaw: String(formData.get("decisions") ?? ""),
      outcomesRaw: String(formData.get("outcomes") ?? ""),
      repoUrl: String(formData.get("repoUrl") ?? ""),
      liveUrl: String(formData.get("liveUrl") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
    })
  );
  if (!validated.success) redirectWithErrors(basePath, validated.errors);
  enforcePublishEligibility(publishRequested, basePath, validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "projects", action: "update", reason: "mdx_error", details: mdxError });
    redirectWithErrors(basePath, { body: mdxError });
  }
  if (await isProjectSlugTaken(validated.value.slug, id)) redirectWithErrors(basePath, { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedProjects(id),
    domain: "projects",
    basePath,
  });
  const current = await getAdminProjectById(id);
  if (!current) redirect("/admin/projects?status=missing");
  try {
    const saved = await updateProject(id, validated.value);
    logMutationEvent({ domain: "projects", action: "update", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "projects",
      slug: saved.slug,
      previousSlug: current.slug,
      tags: saved.tags,
      previousTags: current.tags ?? [],
      published: saved.published,
      previousPublished: current.published,
      featured: Boolean(saved.featured),
      previousFeatured: Boolean(current.featured),
    });
    if (isPreviewIntent) redirect(`/preview/projects/${saved.slug}`);
    redirect("/admin/projects?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "projects", action: "update", reason: "mutation_error", details: error });
    redirectWithErrors(basePath, { _global: "Failed to update project item." });
  }
}

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/projects?status=delete_error");
  }

  const result = await deleteProjectById(id);
  if (!result.ok) {
    redirect("/admin/projects?status=delete_missing");
  }
  logMutationEvent({ domain: "projects", action: "delete", slug: result.slug ?? "" });

  revalidateContentSurfaces({
    domain: "projects",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/projects?status=deleted");
}
