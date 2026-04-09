"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  pendingLabel: string;
  name: string;
  value: string;
  variant?: "primary" | "secondary" | "danger";
  formTarget?: string;
};

export function SubmitButton({
  label,
  pendingLabel,
  name,
  value,
  variant = "primary",
  formTarget,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const baseClass =
    "rounded-md px-4 py-2 font-mono text-sm transition-[opacity,transform,background-color] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/25";
  const variantClass =
    variant === "secondary"
      ? "border border-black/20 text-black hover:bg-black/[0.03]"
      : variant === "danger"
        ? "bg-red-700 text-white hover:opacity-90"
        : "bg-black text-white hover:opacity-90";

  return (
    <button
      type="submit"
      name={name}
      value={value}
      formTarget={formTarget}
      disabled={pending}
      aria-busy={pending}
      className={`${baseClass} ${variantClass}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
