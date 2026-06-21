"use client";

import { useEffect, useState } from "react";
import type { FormActionState } from "@/lib/action-state";

export function usePersistedFormValues<T extends Record<string, string>>(
  defaults: T,
  state: FormActionState
): T {
  const [values, setValues] = useState<T>(defaults);

  useEffect(() => {
    if (!state.ok && state.values) {
      setValues((prev) => ({ ...prev, ...(state.values as T) }));
    }
  }, [state.ok, state.values]);

  return values;
}

export function fieldValue(
  values: Record<string, string>,
  key: string,
  fallback = ""
) {
  return values[key] ?? fallback;
}
