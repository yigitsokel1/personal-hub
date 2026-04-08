"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteWritingById } from "@/lib/content-source/get-writing";

export async function deleteWritingAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/writing?status=delete_error");
  }

  const result = await deleteWritingById(id);
  if (!result.ok) {
    redirect("/admin/writing?status=delete_missing");
  }

  revalidatePath("/writing");
  revalidatePath("/admin/writing");
  if (result.slug) {
    revalidatePath(`/writing/${result.slug}`);
  }
  redirect("/admin/writing?status=deleted");
}
