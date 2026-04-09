import { redirect } from "next/navigation";
import { assertFeaturedLimit } from "@/lib/content-policies/featured";
import { getPublishEligibility } from "@/lib/content-policies/publish";
import type { ContentDomain } from "@/lib/content-source/types";

export function redirectWithErrors(basePath: string, errors: Record<string, string>): never {
  const payload = encodeURIComponent(JSON.stringify(errors));
  redirect(`${basePath}?status=error&errors=${payload}`);
}

export function enforcePublishEligibility(
  publishRequested: boolean,
  basePath: string,
  input: {
    slug: string;
    summary: string;
    body: string;
    publishedAt?: string;
  }
): void {
  if (!publishRequested) return;
  const errors = getPublishEligibility(input);
  if (Object.keys(errors).length > 0) {
    redirectWithErrors(basePath, errors);
  }
}

export function enforceFeaturedLimit(options: {
  featured: boolean;
  featuredCount: number;
  domain: ContentDomain;
  basePath: string;
}): void {
  if (!options.featured) return;
  const error = assertFeaturedLimit(options.domain, options.featuredCount);
  if (error) {
    redirectWithErrors(options.basePath, { featured: error });
  }
}

export async function validateMdxBody(body: string): Promise<string | null> {
  try {
    const { serialize } = await import("next-mdx-remote/serialize");
    await serialize(body);
    return null;
  } catch {
    return "Body must be valid MDX syntax.";
  }
}
