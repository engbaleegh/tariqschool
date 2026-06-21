import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { ResultUploadForm } from "@/components/admin/ResultUploadForm";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewResultPage({ params }: PageProps) {
  const { locale } = await params;
  const listHref = `/${locale}/${Routes.ADMIN}/${Routes.RESULTS}`;

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "رفع نتيجة" : "Upload result"}
        description={
          locale === "ar"
            ? "ارفع ملف نتائج كامل (PDF أو صورة)"
            : "Upload a complete results file (PDF or image)"
        }
      />
      <ResultUploadForm locale={locale} />
      <Link href={listHref} className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
        ← {locale === "ar" ? "العودة للقائمة" : "Back to list"}
      </Link>
    </div>
  );
}
