import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Intentionally minimal configuration.
   * This platform is admin-managed, typed, and domain-driven.
   * Runtime content comes from DB-backed domains through validated content-source adapters.
   *
   * Deployment-critical envs:
   * - NEXT_PUBLIC_SITE_URL for canonical/OG/sitemap/RSS absolute URLs
   * - CONTENT_HEALTH_STRICT to fail builds on blocking content issues
   *
   * Images: put files in `public/` and reference `/your-file.jpg` in DB-backed cover fields.
   * Add `images.remotePatterns` only when remote hosts are explicitly needed.
   */
};

export default nextConfig;
