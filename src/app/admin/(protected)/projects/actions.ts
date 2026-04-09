"use server";

import { redirect } from "next/navigation";
import { deleteProjectById } from "@/lib/content-source/get-projects";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/projects?status=delete_error");
  }

  const result = await deleteProjectById(id);
  if (!result.ok) {
    redirect("/admin/projects?status=delete_missing");
  }

  revalidateContentSurfaces({
    domain: "projects",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/projects?status=deleted");
}
