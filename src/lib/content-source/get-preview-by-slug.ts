import type { ContentWithBody } from "@/lib/content/get-content";
import type { LabContent, ProjectContent, WorkContent, WritingContent } from "@/lib/content/types";
import { getLabBySlug } from "@/lib/content-source/get-labs";
import { getProjectBySlug } from "@/lib/content-source/get-projects";
import { getWorkBySlug } from "@/lib/content-source/get-work";
import { getWritingBySlug } from "@/lib/content-source/get-writing";

export type PreviewDomain = "writing" | "projects" | "work" | "labs";

export async function getPreviewBySlug(
  domain: PreviewDomain,
  slug: string
): Promise<
  | ContentWithBody<WritingContent>
  | ContentWithBody<ProjectContent>
  | ContentWithBody<WorkContent>
  | ContentWithBody<LabContent>
  | null
> {
  if (domain === "writing") {
    return getWritingBySlug(slug, { includeUnpublished: true });
  }
  if (domain === "projects") {
    return getProjectBySlug(slug, { includeUnpublished: true });
  }
  if (domain === "work") {
    return getWorkBySlug(slug, { includeUnpublished: true });
  }
  return getLabBySlug(slug, { includeUnpublished: true });
}
