import PageHeader from "@/components/admin/PageHeader";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import type { Locale } from "@/i18n.config";

type NewAnnouncementPageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function NewAnnouncementPage({ params }: NewAnnouncementPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إعلان جديد" : "New announcement"}
        description={isAr ? "إنشاء إعلان مدرسي" : "Create a school announcement."}
      />
      <AnnouncementForm locale={locale} mode="create" />
    </div>
  );
}
