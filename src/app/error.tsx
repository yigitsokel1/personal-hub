"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  primaryEmphasisLinkClassName,
  shellSecondaryLinkClassName,
} from "@/lib/ui/link-tokens";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <p className="text-sm text-black/50">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          We couldn’t load this page
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-black/75">
          A temporary error occurred. You can try again or return to the
          homepage.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className={`cursor-pointer border-0 bg-transparent p-0 ${primaryEmphasisLinkClassName}`}
          >
            Try again
          </button>
          <Link href="/" className={shellSecondaryLinkClassName}>
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
