"use client";

import { useFormStatus } from "react-dom";

export function DeleteProjectButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="font-mono text-xs text-red-700 underline decoration-red-200 underline-offset-4 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "deleting..." : "delete"}
    </button>
  );
}
