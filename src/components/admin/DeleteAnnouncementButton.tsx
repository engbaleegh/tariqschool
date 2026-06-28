"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAnnouncementAction } from "@/server/actions/announcements";

type Props = { id: string; locale: string };

export function DeleteAnnouncementButton({ id, locale }: Props) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!confirm(isAr ? "حذف هذا الإعلان؟" : "Delete this announcement?")) return;

    setError("");
    startTransition(async () => {
      const result = await deleteAnnouncementAction(id, locale);
      if (result.ok) {
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
