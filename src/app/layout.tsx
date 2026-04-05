import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { homepageCopy } from "@/lib/content/homepage-copy";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";
import "./globals.css";

const metadataBase = getSiteMetadataBase();

export const viewport: Viewport = {
  themeColor: "#171717",
};

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  manifest: "/manifest.webmanifest",
  title: {
    default: homepageCopy.siteTitle,
    template: `%s | ${homepageCopy.siteName}`,
  },
  description: homepageCopy.siteDescription,
  openGraph: {
    type: "website",
    siteName: homepageCopy.siteName,
    title: homepageCopy.siteTitle,
    description: homepageCopy.siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
