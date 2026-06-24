import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { CalendarEventForm } from "@/components/admin/CalendarEventForm";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditCalendarPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const entry = await db.calendarEvent.findUnique({ where: { id } }).catch(() => null);
  if (!entry) notFound();

  return (
    <div>
      <PageHeader title={isAr ? "تعديل حدث التقويم" : "Edit calendar event"} description={entry.titleAr ?? entry.title} />
      <CalendarEventForm
        locale={locale}
        mode="edit"
        entryId={id}
        defaultValues={{
          title: entry.title,
          titleAr: entry.titleAr ?? undefined,
          description: entry.description ?? undefined,
          descriptionAr: entry.descriptionAr ?? undefined,
          startDate: entry.startDate.toISOString().split("T")[0],
          endDate: entry.endDate?.toISOString().split("T")[0],
          type: entry.type,
          isPublished: entry.isPublished,
        }}
      />
    </div>
  );
}
