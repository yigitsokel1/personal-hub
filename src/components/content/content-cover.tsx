import Image from "next/image";

type ContentCoverProps = {
  src: string;
  alt?: string;
  className?: string;
};

/**
 * Hero cover from frontmatter `cover`. Use paths under `public/` (e.g. `/covers/x.jpg`).
 * Remote URLs use `<img>` until `images.remotePatterns` is configured in next.config.
 */
export function ContentCover({ src, alt, className }: ContentCoverProps) {
  const isRemote = /^https?:\/\//i.test(src);
  const isLocalPublic = src.startsWith("/") && !src.startsWith("//");

  const wrap = className ?? "mt-8";

  if (isLocalPublic && !isRemote) {
    return (
      <div
        className={`relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border border-black/5 ${wrap}`}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 48rem"
          priority
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote covers without remotePatterns
    <img
      src={src}
      alt={alt ?? ""}
      className={`max-h-80 w-full max-w-3xl rounded-lg border border-black/5 object-cover ${wrap}`}
    />
  );
}
