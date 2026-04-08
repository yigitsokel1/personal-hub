import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getPublishedLabs } from "@/lib/content-source/get-labs";
import { getPublishedWork } from "@/lib/content-source/get-work";
import { getPublishedWriting } from "@/lib/content-source/get-writing";

export async function getAllContent() {
  const { value: writing } = await getPublishedWriting();
  const { value: projects } = await getPublishedProjects();
  const { value: work } = await getPublishedWork();
  const { value: labs } = await getPublishedLabs();

  return {
    writing,
    projects,
    work,
    labs,
  };
}
