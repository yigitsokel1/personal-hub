import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Intentionally minimal configuration.
   * This platform is CMS-free, code-first, and content-driven with static sources.
   * Runtime fetch dependencies are avoided in favor of typed local content.
   *
   * Deployment-critical envs:
   * - NEXT_PUBLIC_SITE_URL for canonical/OG/sitemap/RSS absolute URLs
   * - CONTENT_HEALTH_STRICT to fail builds on blocking content issues
   *
   * Images: put files in `public/` and reference `/your-file.jpg` in MDX/frontmatter.
   * Add `images.remotePatterns` only when remote hosts are explicitly needed.
   */
};

export default nextConfig;
