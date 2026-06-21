import Link from "next/link";
import { cn } from "@/lib/utils";

type FormActionsProps = {
  cancelHref: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  className?: string;
  locale?: string;
};

export default function FormActions({
  cancelHref,
  submitLabel = "Save",
  isSubmitting = false,
  className,
  locale = "en",
}: FormActionsProps) {
  const isAr = locale === "ar";

  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end",
        className
      )}
    >
      <Link
        href={cancelHref}
        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        {isAr ? "إلغاء" : "Cancel"}
      </Link>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </div>
  );
}
