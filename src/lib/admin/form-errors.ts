export type AdminFormErrorState = {
  fieldErrors: Record<string, string>;
  globalError?: string;
};

export function parseAdminFormErrors(rawErrors?: string): AdminFormErrorState {
  if (!rawErrors) {
    return { fieldErrors: {} };
  }

  try {
    const parsed = JSON.parse(rawErrors) as Record<string, string>;
    const { _global, ...fieldErrors } = parsed;
    return {
      fieldErrors,
      globalError: _global,
    };
  } catch {
    return { fieldErrors: {} };
  }
}
