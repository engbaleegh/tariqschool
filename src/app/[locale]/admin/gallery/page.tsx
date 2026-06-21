import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminGalleryPage({ params }: PageProps) {
  await params;

  let rows: { id: string; title: string; category: string; status: string }[] = [];
  try {
    const items = await db.galleryAlbum.findMany({ orderBy: { order: "asc" } });
    rows = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.isPublished ? "Published" : "Hidden",
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader title="Gallery" description="Photo albums and gallery images." />
      <DataTable
        columns={[
          { key: "title", header: "Album" },
          { key: "category", header: "Category" },
          { key: "status", header: "Status" },
        ]}
        data={rows}
      />
    </div>
  );
}
