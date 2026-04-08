import { getPublishedProjects } from "@/lib/content-source/get-projects";
import { getPublishedLabs } from "@/lib/content-source/get-labs";
import { getPublishedWork } from "@/lib/content-source/get-work";
import { getPublishedWriting } from "@/lib/content-source/get-writing";

export async function getAllContent() {
  const [{ value: writing }, { value: projects }, { value: work }, { value: labs }] =
    await Promise.all([
      getPublishedWriting(),
      getPublishedProjects(),
      getPublishedWork(),
      getPublishedLabs(),
    ]);

  return {
    writing,
    projects,
    work,
    labs,
  };
}
