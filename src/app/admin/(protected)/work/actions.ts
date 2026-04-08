"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteWorkById } from "@/lib/content-source/get-work";

export async function deleteWorkAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/work?status=delete_error");
  }

  const result = await deleteWorkById(id);
  if (!result.ok) {
    redirect("/admin/work?status=delete_missing");
  }

  revalidatePath("/work");
  revalidatePath("/admin/work");
  if (result.slug) {
    revalidatePath(`/work/${result.slug}`);
  }
  redirect("/admin/work?status=deleted");
}
