import PageHeader from "@/components/admin/PageHeader";
import { EventsAdminTable } from "@/components/admin/tables/EventsAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }>; searchParams?: Promise<{ saved?: string }> };

export default async function AdminEventsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/events`;

  let rows: { id: string; title: string; date: string; status: string }[] = [];
  try {
    const items = await db.event.findMany({ orderBy: { eventDate: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.titleAr ?? item.title,
      date: item.eventDate.toLocaleDateString(locale),
      status: item.isPublished ? (isAr ? "منشور" : "Published") : isAr ? "مسودة" : "Draft",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "الفعاليات" : "Events"}
        description={isAr ? "إدارة الأنشطة والفعاليات المدرسية" : "Manage school activities and events."}
        action={{ label: isAr ? "إضافة فعالية" : "Add event", href: `${base}/new` }}
      />
      {query.saved === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حفظ الفعالية بنجاح" : "Event saved successfully"}
        </p>
      )}
      <EventsAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا توجد فعاليات بعد" : "No events yet"}
      />
    </div>
  );
}
