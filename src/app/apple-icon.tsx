import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#171717",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 42,
          paddingRight: 42,
          gap: 16,
        }}
      >
        <div style={{ width: 96, height: 14, background: "#ffffff" }} />
        <div style={{ width: 96, height: 14, background: "#ffffff" }} />
        <div style={{ width: 66, height: 14, background: "#ffffff" }} />
      </div>
    ),
    size,
  );
}
