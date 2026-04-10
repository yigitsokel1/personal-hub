"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  nextPath: string | null;
  initialError?: string;
};

function mapError(errorCode: string | null): string | null {
  if (!errorCode) return null;
  if (errorCode === "invalid_password") return "Invalid password.";
  if (errorCode === "preview_auth_required") return "Admin login is required to open preview links.";
  if (errorCode === "missing_password") return "Password is required.";
  if (errorCode === "rate_limited") return "Too many attempts. Try again in about a minute.";
  if (errorCode === "auth_unavailable") return "Admin auth is unavailable. Check admin auth environment variables.";
  return "Unable to sign in right now.";
}

export function LoginForm({ nextPath, initialError }: Props) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(initialError ?? null);
  const errorMessage = useMemo(() => mapError(errorCode), [errorCode]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setErrorCode(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, next: nextPath ?? "" }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setErrorCode(data?.error ?? "auth_unavailable");
        return;
      }

      const data = (await response.json()) as { redirectTo?: string };
      router.replace(data.redirectTo ?? "/admin/settings");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <label className="block">
        <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-black/50">
          Password
        </span>
        <input
          name="password"
          type="password"
          className="w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition-colors focus:border-black/35 disabled:cursor-not-allowed disabled:opacity-60"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          disabled={isLoading}
        />
      </label>
      {errorMessage ? <p className="mt-3 text-sm text-red-700">{errorMessage}</p> : null}
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 font-mono text-sm text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
