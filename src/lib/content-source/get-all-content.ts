import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getPublishedWork } from "@/lib/content-source/get-work";
import { getPublishedWriting } from "@/lib/content-source/get-writing";
import { getPublishedContentEntries } from "@/lib/content/get-content";

export async function getAllContent() {
  const { value: writing } = await getPublishedWriting();
  const { value: projects } = await getPublishedProjects();
  const { value: work } = await getPublishedWork();

  return {
    writing,
    projects,
    work,
    labs: getPublishedContentEntries("lab"),
  };
}
