import Link from "next/link";
import { FileText, Image as ImageIcon, Download, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n.config";
import { getLocalizedField } from "@/lib/utils";

export type PublishedResult = {
  id: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  academicYear?: string | null;
  semester?: string | null;
  category?: string | null;
  fileUrl: string;
  fileType: string;
  createdAt?: string;
};

type ResultsListProps = {
  locale: Locale;
  results: PublishedResult[];
  compact?: boolean;
};

export function ResultsList({ locale, results, compact = false }: ResultsListProps) {
  const isAr = locale === "ar";

  if (!results.length) {
    return (
      <p className="text-center text-slate-500">
        {isAr ? "لا توجد نتائج منشورة حالياً" : "No published results yet"}
      </p>
    );
  }

  return (
    <div className={compact ? "grid gap-3 md:grid-cols-2" : "space-y-4"}>
      {results.map((result) => {
        const title = getLocalizedField(result, "title", locale);
        const description = getLocalizedField(result, "description", locale);
        const isPdf = result.fileType === "PDF";

        return (
          <article key={result.id} className="card flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                {isPdf ? <FileText className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900">{title}</h3>
                {description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{description}</p>}
                <p className="mt-1 text-xs text-slate-500">
                  {[result.category, result.academicYear, result.semester].filter(Boolean).join(" • ")}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={result.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ExternalLink className="h-4 w-4" />
                {isAr ? "عرض" : "View"}
              </a>
              <a
                href={result.fileUrl}
                download
                className="inline-flex items-center gap-1 rounded-lg bg-blue-800 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900"
              >
                <Download className="h-4 w-4" />
                {isAr ? "تحميل" : "Download"}
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function HomeResultsSection({
  locale,
  results,
  viewAllHref,
}: {
  locale: Locale;
  results: PublishedResult[];
  viewAllHref: string;
}) {
  const isAr = locale === "ar";
  if (!results.length) return null;

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
      <div className="container-school">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-blue-900">{isAr ? "النتائج" : "Results"}</h2>
          <Link href={viewAllHref} className="text-sm font-medium text-blue-700 hover:underline">
            {isAr ? "عرض الكل ←" : "View all →"}
          </Link>
        </div>
        <ResultsList locale={locale} results={results.slice(0, 4)} compact />
      </div>
    </section>
  );
}
