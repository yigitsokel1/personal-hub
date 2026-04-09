import type { ContentDomain } from "@/lib/content-source/types";

type MutationAction = "create" | "update" | "delete";

export function logMutationEvent(input: {
  domain: ContentDomain;
  action: MutationAction;
  slug: string;
}) {
  console.info("[admin.mutation]", {
    domain: input.domain,
    action: input.action,
    slug: input.slug,
    timestamp: new Date().toISOString(),
  });
}

export function logMutationError(input: {
  domain: ContentDomain;
  action: MutationAction;
  reason: "mdx_error" | "publish_error" | "mutation_error";
  details?: unknown;
}) {
  console.error("[admin.mutation.error]", {
    domain: input.domain,
    action: input.action,
    reason: input.reason,
    timestamp: new Date().toISOString(),
    details: input.details,
  });
}
