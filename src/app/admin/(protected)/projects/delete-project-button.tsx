"use client";

import { useFormStatus } from "react-dom";

export function DeleteProjectButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="font-mono text-xs text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
