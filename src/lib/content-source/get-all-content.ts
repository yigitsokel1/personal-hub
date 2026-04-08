import { getPublishedContentEntries } from "@/lib/content/get-content";
import { getPublishedWriting } from "@/lib/content-source/get-writing";

export async function getAllContent() {
  const { value: writing } = await getPublishedWriting();

  return {
    writing,
    projects: getPublishedContentEntries("project"),
    work: getPublishedContentEntries("work"),
    labs: getPublishedContentEntries("lab"),
  };
}
