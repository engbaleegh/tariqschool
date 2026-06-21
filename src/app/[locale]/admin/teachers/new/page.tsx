import PageHeader from "@/components/admin/PageHeader";
import { TeacherForm } from "@/components/admin/TeacherForm";
import type { Locale } from "@/i18n.config";

type NewTeacherPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function NewTeacherPage({ params }: NewTeacherPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إضافة معلم" : "Add teacher"}
        description={isAr ? "أدخل بيانات المعلم — الاسم فقط كافٍ للبدء" : "Enter teacher details — name alone is enough to start"}
      />
      <TeacherForm locale={locale} mode="create" />
    </div>
  );
}
