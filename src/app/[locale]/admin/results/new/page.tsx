import PageHeader from "@/components/admin/PageHeader";
import { ResultForm } from "@/components/admin/ResultForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewResultPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "رفع نتيجة" : "Upload result"}
        description={isAr ? "ارفع ملف نتيجة كامل (PDF أو صورة)" : "Upload a complete result file (PDF or image)"}
      />
      <ResultForm locale={locale} mode="create" />
    </div>
  );
}
