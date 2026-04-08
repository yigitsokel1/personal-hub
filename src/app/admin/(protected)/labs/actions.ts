"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteLabById } from "@/lib/content-source/get-labs";

export async function deleteLabAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/labs?status=delete_error");
  }

  const result = await deleteLabById(id);
  if (!result.ok) {
    redirect("/admin/labs?status=delete_missing");
  }

  revalidatePath("/labs");
  revalidatePath("/admin/labs");
  if (result.slug) {
    revalidatePath(`/labs/${result.slug}`);
  }
  redirect("/admin/labs?status=deleted");
}
