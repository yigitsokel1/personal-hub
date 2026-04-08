"use client";

import { useFormStatus } from "react-dom";

export function DeleteLabButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-xs text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "deleting..." : "delete"}
    </button>
  );
}
