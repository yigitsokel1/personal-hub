"use client";

type DeleteWritingButtonProps = {
  label?: string;
};

export function DeleteWritingButton({ label = "delete" }: DeleteWritingButtonProps) {
  return (
    <button
      type="submit"
      className="font-mono text-xs text-red-700 underline decoration-red-300 underline-offset-4 hover:text-red-800"
      onClick={(event) => {
        if (!window.confirm("Delete this entry?")) {
          event.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
