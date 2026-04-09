"use server";

import { redirect } from "next/navigation";
import { deleteLabById } from "@/lib/content-source/get-labs";
import { revalidateContentSurfaces } from "@/lib/revalidation/content-revalidation";

export async function deleteLabAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/labs?status=delete_error");
  }

  const result = await deleteLabById(id);
  if (!result.ok) {
    redirect("/admin/labs?status=delete_missing");
  }

  revalidateContentSurfaces({
    domain: "labs",
    previousSlug: result.slug,
    previousTags: result.tags,
    previousPublished: result.published,
    previousFeatured: result.featured,
  });
  redirect("/admin/labs?status=deleted");
}
