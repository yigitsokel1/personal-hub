"use server";

import { redirect } from "next/navigation";
import { deleteWritingById } from "@/lib/content-source/get-writing";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function deleteWritingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/writing?status=delete_error");
  }

  const result = await deleteWritingById(id);
  if (!result.ok) {
    redirect("/admin/writing?status=delete_missing");
  }

  revalidateContentSurfaces({
    domain: "writing",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/writing?status=deleted");
}
