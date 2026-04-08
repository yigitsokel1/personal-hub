"use client";

import { useFormStatus } from "react-dom";

export function DeleteWorkButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="font-mono text-xs text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
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
