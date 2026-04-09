"use client";

import { useFormStatus } from "react-dom";

export function DeleteLabButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      type="submit"
      disabled={pending}
      className="font-mono text-xs text-red-700 underline decoration-red-300 underline-offset-4 transition-[color,opacity] duration-200 ease-out hover:text-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700/30 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={(event) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
          event.preventDefault();
        }
      }}
    >
      {pending ? "Deleting item..." : "Delete"}
    </button>
  );
}
