import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

async function adminListPage(title: string, description: string, fetchRows: () => Promise<Record<string, string>[]>, columns: { key: string; header: string }[]) {
  let rows: Record<string, string>[] = [];
  try {
    rows = await fetchRows();
  } catch {
    rows = [];
  }
  return (
    <div>
      <PageHeader title={title} description={description} />
      <DataTable columns={columns} data={rows} />
    </div>
  );
}

export default async function AdminEventsPage({ params }: PageProps) {
  await params;
  return adminListPage(
    "Events",
    "School events and activities.",
    async () => {
      const items = await db.event.findMany({ orderBy: { eventDate: "desc" } });
      return items.map((item) => ({
        id: item.id,
        title: item.title,
        date: item.eventDate.toLocaleDateString(),
        status: item.isPublished ? "Published" : "Draft",
      }));
    },
    [
      { key: "title", header: "Title" },
      { key: "date", header: "Date" },
      { key: "status", header: "Status" },
    ]
  );
}
