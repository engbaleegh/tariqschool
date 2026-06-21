"use client";

import { deleteSchoolResult } from "@/server/actions/results";

type DeleteResultButtonProps = {
  id: string;
  locale: string;
};

export function DeleteResultButton({ id, locale }: DeleteResultButtonProps) {
  const isAr = locale === "ar";
  const deleteAction = deleteSchoolResult.bind(null, id, locale);

  return (
    <form action={deleteAction}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800"
        onClick={(e) => {
          if (!confirm(isAr ? "حذف هذه النتيجة؟" : "Delete this result?")) {
            e.preventDefault();
          }
        }}
      >
        {isAr ? "حذف" : "Delete"}
      </button>
    </form>
  );
}
