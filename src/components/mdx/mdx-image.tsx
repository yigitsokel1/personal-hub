import Image from "next/image";

type MdxImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * MDX images: use `/...` paths for files in `public/` (optimized via next/image).
 * Remote `http(s)://` URLs render as `<img>` until `images.remotePatterns` is set in next.config.
 */
export function MdxImage({ src, alt, className }: MdxImageProps) {
  if (!src || typeof src !== "string") return null;

  const isRemote = /^https?:\/\//i.test(src);
  const isLocalPublic = src.startsWith("/") && !src.startsWith("//");

  if (isLocalPublic && !isRemote) {
    return (
      <span className="mt-6 block max-w-full">
        <Image
          src={src}
          alt={alt ?? ""}
          width={1200}
          height={675}
          className={`h-auto max-h-112 w-full rounded-lg border border-black/5 object-contain ${className ?? ""}`}
          sizes="(max-width: 768px) 100vw, 48rem"
        />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote or data URLs without Next image config
    <img
      src={src}
      alt={alt ?? ""}
      className={`mt-6 max-h-112 max-w-full rounded-lg border border-black/5 ${className ?? ""}`}
    />
  );
}
