import PageHeader from "@/components/admin/PageHeader";
import { CalendarEventForm } from "@/components/admin/CalendarEventForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewCalendarPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إضافة حدث للتقويم" : "Add calendar event"}
        description={isAr ? "عنوان الحدث، التاريخ، والوصف" : "Event title, date, and description"}
      />
      <CalendarEventForm locale={locale} mode="create" />
    </div>
  );
}
