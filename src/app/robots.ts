import type { MetadataRoute } from "next";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteMetadataBase();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/preview"],
    },
    sitemap: base ? `${base.origin}/sitemap.xml` : undefined,
  };
}
