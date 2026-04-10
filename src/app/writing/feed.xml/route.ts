import { getPublishedWriting } from "@/lib/content-source/get-writing";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822FromIso(isoDate: string): string {
  return new Date(isoDate).toUTCString();
}

let rssRelativeLinkWarned = false;

export async function GET() {
  const base = getSiteMetadataBase();
  const origin = base?.origin.replace(/\/$/, "") ?? "";
  const { value: settings } = await getSiteSettings();
  const { value: writing } = await getPublishedWriting();

  if (
    !origin &&
    writing.length > 0 &&
    !rssRelativeLinkWarned &&
    process.env.NODE_ENV === "development"
  ) {
    rssRelativeLinkWarned = true;
    console.warn(
      "RSS: NEXT_PUBLIC_SITE_URL is unset; item <link> and <guid> use relative URLs. Set the env var for production feeds."
    );
  }

  const channelLink = origin ? `${origin}/` : "/";

  const itemsXml = writing
    .map((item) => {
      const description = item.seo?.description ?? item.summary;
      const link = origin
        ? `${origin}/writing/${item.slug}`
        : `/writing/${item.slug}`;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${escapeXml(rfc822FromIso(item.publishedAt))}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(settings.brandLabel)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(settings.heroSubtitle)}</description>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
