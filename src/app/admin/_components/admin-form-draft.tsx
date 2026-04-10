"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type DraftMap = Record<string, string[]>;

function getStorageKey(pathname: string): string {
  return `admin-form-draft:${pathname}`;
}

export function AdminFormDraft({ formId }: { formId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const form = document.getElementById(formId);
    if (!(form instanceof HTMLFormElement)) return;

    const status = searchParams.get("status");
    const key = getStorageKey(pathname);

    if (status === "error") {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        try {
          const values = JSON.parse(raw) as DraftMap;
          for (const field of Array.from(form.elements)) {
            if (
              !(field instanceof HTMLInputElement) &&
              !(field instanceof HTMLTextAreaElement) &&
              !(field instanceof HTMLSelectElement)
            ) {
              continue;
            }
            if (!field.name) continue;
            const stored = values[field.name] ?? [];

            if (field instanceof HTMLInputElement && field.type === "checkbox") {
              field.checked = stored.length > 0;
              continue;
            }
            if (field instanceof HTMLInputElement && field.type === "radio") {
              field.checked = stored.includes(field.value);
              continue;
            }
            if (stored.length > 0) {
              field.value = stored[0] ?? "";
            }
          }
        } catch {
          sessionStorage.removeItem(key);
        }
      }
    } else if (status === "saved") {
      sessionStorage.removeItem(key);
    }

    const handleSubmit = () => {
      const formData = new FormData(form);
      const values: DraftMap = {};
      for (const [name, value] of formData.entries()) {
        if (typeof value !== "string") continue;
        if (!values[name]) values[name] = [];
        values[name]!.push(value);
      }
      sessionStorage.setItem(key, JSON.stringify(values));
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [formId, pathname, searchParams]);

  return null;
}
