"use client";

import { toggleGraduateActive } from "@/server/actions/graduates";

type ToggleGraduateButtonProps = {
  id: string;
  locale: string;
  isActive: boolean;
};

export function ToggleGraduateButton({ id, locale, isActive }: ToggleGraduateButtonProps) {
  const isAr = locale === "ar";
  const nextActive = !isActive;

  return (
    <form action={toggleGraduateActive.bind(null, id, locale, nextActive)}>
      <button type="submit" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
        {isActive ? (isAr ? "إيقاف" : "Deactivate") : isAr ? "تفعيل" : "Activate"}
      </button>
    </form>
  );
}
