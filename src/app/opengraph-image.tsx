import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/content-source/get-site-settings";
import { getSiteMetadataBase } from "@/lib/seo/build-metadata";

export const alt = "Personal Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { value: settings } = await getSiteSettings();
  const base = getSiteMetadataBase();
  const siteLabel = settings.brandLabel;
  const siteDescription = settings.heroSubtitle;
  const siteOrigin = base?.origin.replace(/^https?:\/\//, "") ?? "";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "#ffffff",
          color: "#171717",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(23,23,23,0.45)",
          }}
        >
          {siteOrigin || "Personal hub"}
        </p>
        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {siteLabel}
        </p>
        <p
          style={{
            marginTop: 28,
            marginBottom: 0,
            fontSize: 26,
            lineHeight: 1.45,
            color: "rgba(23,23,23,0.72)",
            maxWidth: 880,
          }}
        >
          {siteDescription}
        </p>
      </div>
    ),
    size,
  );
}
