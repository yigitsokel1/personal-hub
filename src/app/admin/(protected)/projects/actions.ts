"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteProjectById } from "@/lib/content-source/get-projects";

export async function deleteProjectAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/projects?status=delete_error");
  }

  const result = await deleteProjectById(id);
  if (!result.ok) {
    redirect("/admin/projects?status=delete_missing");
  }

  revalidatePath("/projects");
  revalidatePath("/admin/projects");
  if (result.slug) {
    revalidatePath(`/projects/${result.slug}`);
  }
  redirect("/admin/projects?status=deleted");
}
