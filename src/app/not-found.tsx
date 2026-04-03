import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm uppercase tracking-[0.14em] text-black/50">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-black/70">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-sm underline underline-offset-4"
      >
        Return home
      </Link>
    </main>
  );
}
