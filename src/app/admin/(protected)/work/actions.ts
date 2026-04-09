"use server";

import { redirect } from "next/navigation";
import { deleteWorkById } from "@/lib/content-source/get-work";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function deleteWorkAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/work?status=delete_error");
  }

  const result = await deleteWorkById(id);
  if (!result.ok) {
    redirect("/admin/work?status=delete_missing");
  }

  revalidateContentSurfaces({
    domain: "work",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/work?status=deleted");
}
