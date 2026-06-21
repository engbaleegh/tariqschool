import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminCalendarPage({ params }: PageProps) {
  await params;

  let rows: { id: string; title: string; start: string; type: string }[] = [];
  try {
    const items = await db.calendarEvent.findMany({ orderBy: { startDate: "asc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.title,
      start: item.startDate.toLocaleDateString(),
      type: item.type,
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Academic Calendar" description="Calendar events and term dates." />
      <DataTable
        columns={[
          { key: "title", header: "Event" },
          { key: "start", header: "Start Date" },
          { key: "type", header: "Type" },
        ]}
        data={rows}
      />
    </div>
  );
}
