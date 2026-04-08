import { getPublishedContentEntries } from "@/lib/content/get-content";
import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getPublishedWriting } from "@/lib/content-source/get-writing";

export async function getAllContent() {
  const { value: writing } = await getPublishedWriting();
  const { value: projects } = await getPublishedProjects();

  return {
    writing,
    projects,
    work: getPublishedContentEntries("work"),
    labs: getPublishedContentEntries("lab"),
  };
}
