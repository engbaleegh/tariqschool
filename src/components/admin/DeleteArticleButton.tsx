"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteArticleAction } from "@/server/actions/articles";

type Props = { id: string; locale: string };

export function DeleteArticleButton({ id, locale }: Props) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(isAr ? "حذف هذا المقال؟" : "Delete this article?")) return;
          setError("");
          startTransition(async () => {
            const result = await deleteArticleAction(id, locale);
            if (result.ok) {
              router.refresh();
            } else {
              setError(result.error);
            }
          });
        }}
        className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
      >
        {pending ? (isAr ? "جاري الحذف..." : "Deleting...") : isAr ? "حذف" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
