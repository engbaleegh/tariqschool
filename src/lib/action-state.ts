export type FormActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

export const initialFormState: FormActionState = { ok: false };

export function t(locale: string, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}
