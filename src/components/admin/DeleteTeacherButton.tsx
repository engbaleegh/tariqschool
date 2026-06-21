"use client";

import { deleteTeacher } from "@/server/actions/teachers";

type DeleteTeacherButtonProps = {
  id: string;
  locale: string;
};

export function DeleteTeacherButton({ id, locale }: DeleteTeacherButtonProps) {
  const isAr = locale === "ar";

  return (
    <form action={deleteTeacher.bind(null, id, locale)}>
      <button
        type="submit"
        className="text-sm text-red-600 hover:text-red-800"
        onClick={(e) => {
          if (!confirm(isAr ? "حذف هذا المعلم؟" : "Delete this teacher?")) {
            e.preventDefault();
          }
        }}
      >
        {isAr ? "حذف" : "Delete"}
      </button>
    </form>
  );
}
