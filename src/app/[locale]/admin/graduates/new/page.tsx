import PageHeader from "@/components/admin/PageHeader";
import { GraduateForm } from "@/components/admin/GraduateForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewGraduatePage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إضافة خريج" : "Add graduate"}
        description={isAr ? "أضف خريجاً جديداً للعرض في الموقع" : "Add a new graduate for the public site"}
      />
      <GraduateForm locale={locale} mode="create" />
    </div>
  );
}
