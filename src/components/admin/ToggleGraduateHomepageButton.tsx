"use client";

import { toggleGraduateHomepage } from "@/server/actions/graduates";

type Props = {
  id: string;
  locale: string;
  featuredOnHomepage: boolean;
};

export function ToggleGraduateHomepageButton({ id, locale, featuredOnHomepage }: Props) {
  const isAr = locale === "ar";
  const next = !featuredOnHomepage;

  return (
    <form action={toggleGraduateHomepage.bind(null, id, locale, next)}>
      <button
        type="submit"
        className={
          featuredOnHomepage
            ? "text-sm font-medium text-emerald-700 hover:text-emerald-900"
            : "text-sm font-medium text-slate-600 hover:text-indigo-700"
        }
      >
        {featuredOnHomepage
          ? isAr
            ? "في الرئيسية ✓"
            : "On homepage ✓"
          : isAr
            ? "عرض في الرئيسية"
            : "Show on homepage"}
      </button>
    </form>
  );
}
