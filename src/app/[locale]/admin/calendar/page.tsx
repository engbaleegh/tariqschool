import PageHeader from "@/components/admin/PageHeader";
import { CalendarAdminTable } from "@/components/admin/tables/CalendarAdminTable";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }>; searchParams?: Promise<{ saved?: string }> };

export default async function AdminCalendarPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const query = (await searchParams) ?? {};
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}/calendar`;

  let rows: { id: string; title: string; start: string; type: string }[] = [];
  try {
    const items = await db.calendarEvent.findMany({ orderBy: { startDate: "asc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.titleAr ?? item.title,
      start: item.startDate.toLocaleDateString(locale),
      type: item.type,
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "التقويم الأكاديمي" : "Academic Calendar"}
        description={isAr ? "إدارة مواعيد الفصول والامتحانات والإجازات" : "Manage term dates, exams, and holidays."}
        action={{ label: isAr ? "إضافة حدث" : "Add event", href: `${base}/new` }}
      />
      {query.saved === "1" && (
        <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {isAr ? "تم حفظ الحدث بنجاح" : "Calendar event saved successfully"}
        </p>
      )}
      <CalendarAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا توجد أحداث في التقويم بعد" : "No calendar events yet"}
      />
    </div>
  );
}
