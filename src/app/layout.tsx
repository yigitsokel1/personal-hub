import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";
import "./globals.css";

const metadataBase = getSiteMetadataBase();
const SITE_TAB_TITLE = "Osman Yiğit Sökel";

export const viewport: Viewport = {
  themeColor: "#171717",
};

export async function generateMetadata(): Promise<Metadata> {
  const { value: settings } = await getSiteSettings();
  return {
    ...(metadataBase ? { metadataBase } : {}),
    manifest: "/manifest.webmanifest",
    title: {
      default: SITE_TAB_TITLE,
      template: `%s | ${SITE_TAB_TITLE}`,
    },
    description: settings.heroSubtitle,
    openGraph: {
      type: "website",
      siteName: settings.brandLabel,
      title: settings.brandLabel,
      description: settings.heroSubtitle,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
          <div data-public-shell-header>
            <SiteHeader />
          </div>
          <div className="flex-1">{children}</div>
          <div data-public-shell-footer>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
