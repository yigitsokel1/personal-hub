import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="text-sm text-black/50">404</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-black/75">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-black/45 underline decoration-black/15 underline-offset-4 transition-colors hover:text-black/65 hover:decoration-black/30"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
