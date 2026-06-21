import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminDownloadsPage({ params }: PageProps) {
  await params;

  let rows: { id: string; title: string; type: string; status: string }[] = [];
  try {
    const items = await db.download.findMany({ orderBy: { createdAt: "desc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.downloadType,
      status: item.isPublished ? "Published" : "Hidden",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Downloads" description="Forms, circulars, and downloadable files." />
      <DataTable
        columns={[
          { key: "title", header: "Title" },
          { key: "type", header: "Type" },
          { key: "status", header: "Status" },
        ]}
        data={rows}
      />
    </div>
  );
}
