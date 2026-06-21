"use client";

import { deleteGraduate } from "@/server/actions/graduates";

type DeleteGraduateButtonProps = {
  id: string;
  locale: string;
};

export function DeleteGraduateButton({ id, locale }: DeleteGraduateButtonProps) {
  const isAr = locale === "ar";

  return (
    <form action={deleteGraduate.bind(null, id, locale)}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800"
        onClick={(e) => {
          if (!confirm(isAr ? "حذف هذا الخريج؟" : "Delete this graduate?")) {
            e.preventDefault();
          }
        }}
      >
        {isAr ? "حذف" : "Delete"}
      </button>
    </form>
  );
}
