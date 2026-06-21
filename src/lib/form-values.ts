import type { FormActionState } from "@/lib/action-state";

export function extractFormValues(
  formData: FormData,
  keys: string[]
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of keys) {
    const value = formData.get(key);
    values[key] = value instanceof File ? "" : String(value ?? "");
  }
  return values;
}

export function withFormValues(
  state: FormActionState,
  formData: FormData,
  keys: string[]
): FormActionState {
  return { ...state, values: extractFormValues(formData, keys) };
}
