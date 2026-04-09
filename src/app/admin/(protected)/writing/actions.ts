"use server";

import { redirect } from "next/navigation";
import {
  countOtherFeaturedWriting,
  createWriting,
  deleteWritingById,
  getAdminWritingById,
  isSlugTaken,
  updateWriting,
} from "@/lib/content-source/get-writing";
import { toWritingInput } from "@/lib/domain/writing/mapper";
import { validateWritingInput } from "@/lib/domain/writing/validator";
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

export async function createWritingAction(formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";

  const validated = validateWritingInput(
    toWritingInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      category: String(formData.get("category") ?? ""),
      series: String(formData.get("series") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      readingTime: String(formData.get("readingTime") ?? ""),
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );

  if (!validated.success) redirectWithErrors("/admin/writing/new", validated.errors);
  enforcePublishEligibility(publishRequested, "/admin/writing/new", validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "writing", action: "create", reason: "mdx_error", details: mdxError });
    redirectWithErrors("/admin/writing/new", { body: mdxError });
  }
  if (await isSlugTaken(validated.value.slug)) redirectWithErrors("/admin/writing/new", { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedWriting(),
    domain: "writing",
    basePath: "/admin/writing/new",
  });

  try {
    const saved = await createWriting(validated.value);
    logMutationEvent({ domain: "writing", action: "create", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "writing",
      slug: saved.slug,
      tags: saved.tags,
      published: saved.published,
      featured: Boolean(saved.featured),
    });
    if (isPreviewIntent) redirect(`/preview/writing/${saved.slug}`);
    redirect("/admin/writing?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "writing", action: "create", reason: "mutation_error", details: error });
    redirectWithErrors("/admin/writing/new", { _global: "Failed to save writing item." });
  }
}

export async function updateWritingAction(id: string, formData: FormData): Promise<void> {
  const isPreviewIntent = String(formData.get("intent") ?? "") === "preview";
  const publishRequested = !isPreviewIntent && formData.get("published") === "on";
  const basePath = `/admin/writing/${id}`;

  const validated = validateWritingInput(
    toWritingInput({
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      body: String(formData.get("body") ?? ""),
      tagsRaw: String(formData.get("tags") ?? ""),
      category: String(formData.get("category") ?? ""),
      series: String(formData.get("series") ?? ""),
      featured: formData.get("featured") === "on",
      published: publishRequested,
      readingTime: String(formData.get("readingTime") ?? ""),
      publishedAt: String(formData.get("publishedAt") ?? ""),
    })
  );

  if (!validated.success) redirectWithErrors(basePath, validated.errors);
  enforcePublishEligibility(publishRequested, basePath, validated.value);
  const mdxError = await validateMdxBody(validated.value.body);
  if (mdxError) {
    logMutationError({ domain: "writing", action: "update", reason: "mdx_error", details: mdxError });
    redirectWithErrors(basePath, { body: mdxError });
  }
  if (await isSlugTaken(validated.value.slug, id)) redirectWithErrors(basePath, { slug: "Slug must be unique." });
  enforceFeaturedLimit({
    featured: validated.value.featured,
    featuredCount: await countOtherFeaturedWriting(id),
    domain: "writing",
    basePath,
  });

  const current = await getAdminWritingById(id);
  if (!current) redirect("/admin/writing?status=missing");

  try {
    const saved = await updateWriting(id, validated.value);
    await recordSlugRedirect("writing", current.slug, saved.slug);
    logMutationEvent({ domain: "writing", action: "update", slug: saved.slug });
    revalidateContentSurfaces({
      domain: "writing",
      slug: saved.slug,
      previousSlug: current.slug,
      tags: saved.tags,
      previousTags: current.tags ?? [],
      published: saved.published,
      previousPublished: current.published,
      featured: Boolean(saved.featured),
      previousFeatured: Boolean(current.featured),
    });
    if (isPreviewIntent) redirect(`/preview/writing/${saved.slug}`);
    redirect("/admin/writing?status=saved");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "writing", action: "update", reason: "mutation_error", details: error });
    redirectWithErrors(basePath, { _global: "Failed to update writing item." });
  }
}

export async function deleteWritingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/writing?status=delete_error");
  }

  try {
    const result = await deleteWritingById(id);
    if (!result.ok) {
      redirect("/admin/writing?status=delete_missing");
    }
    if (result.slug) {
      await cleanupSlugRedirectsForDeletedSlug("writing", result.slug);
    }
    logMutationEvent({ domain: "writing", action: "delete", slug: result.slug ?? "" });

    revalidateContentSurfaces({
      domain: "writing",
      previousSlug: result.slug,
      previousTags: result.tags,
      previousPublished: result.published,
      previousFeatured: result.featured,
    });
    redirect("/admin/writing?status=deleted");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    logMutationError({ domain: "writing", action: "delete", reason: "mutation_error", details: error });
    redirect("/admin/writing?status=delete_error");
  }
}
