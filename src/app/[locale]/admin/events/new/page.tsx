import PageHeader from "@/components/admin/PageHeader";
import { EventForm } from "@/components/admin/EventForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewEventPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "إضافة فعالية" : "Add event"}
        description={isAr ? "اسم الفعالية، التاريخ، النبذة، والصور" : "Event name, date, description, and images"}
      />
      <EventForm locale={locale} mode="create" />
    </div>
  );
}
