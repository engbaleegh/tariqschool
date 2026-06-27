import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const ascii = slugifyAscii(text);
  if (ascii) return ascii;

  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0600-\u06FF-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `item-${Date.now()}`;
}

/** URL-safe slug using Latin letters and numbers only (works on all hosts). */
export function slugifyAscii(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Prefer ASCII slug in public URLs; fall back to id for Arabic-only slugs. */
export function contentUrlSegment(item: { id: string; slug?: string | null }): string {
  const slug = item.slug?.trim();
  if (slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) {
    return slug;
  }
  return item.id;
}

export function decodeRouteParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function resolveBilingualField(primary: string, fallback: string | null) {
  const trimmed = primary.trim();
  if (trimmed) return trimmed;
  return fallback?.trim() ?? "";
}

export function getLocalizedField<T extends Record<string, unknown>>(
  item: T,
  field: string,
  locale: string
): string {
  const arField = `${field}Ar`;
  if (locale === "ar" && arField in item && item[arField]) {
    return String(item[arField]);
  }
  return String(item[field] ?? "");
}

export function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
