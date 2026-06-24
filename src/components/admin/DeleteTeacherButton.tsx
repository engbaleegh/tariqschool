"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteTeacherAction } from "@/server/actions/teachers";

type DeleteTeacherButtonProps = {
  id: string;
  locale: string;
};

export function DeleteTeacherButton({ id, locale }: DeleteTeacherButtonProps) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm(isAr ? "حذف هذا المعلم؟" : "Delete this teacher?")) return;

    setError("");
    startTransition(async () => {
      const result = await deleteTeacherAction(id, locale);
      if (result.ok) {
        router.push(`/${locale}/admin/teachers?deleted=1`);
        router.refresh();
        return;
      }
      setError(result.error);
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={handleDelete}
        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {pending ? (isAr ? "جاري الحذف..." : "Deleting...") : isAr ? "حذف" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
