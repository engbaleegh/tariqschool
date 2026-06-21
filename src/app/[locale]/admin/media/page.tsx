import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import { MediaUploadPanel } from "@/components/admin/MediaUploadPanel";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminMediaPage({ params }: PageProps) {
  const { locale } = await params;

  let rows: { id: string; filename: string; type: string; size: string; date: string; url: string }[] = [];
  try {
    const items = await db.media.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
    rows = items.map((item) => ({
      id: item.id,
      filename: item.filename,
      type: item.mimeType,
      size: `${(item.size / 1024).toFixed(1)} KB`,
      date: item.createdAt.toLocaleDateString(),
      url: item.url,
    }));
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={locale === "ar" ? "مكتبة الوسائط" : "Media Library"}
        description={
          locale === "ar"
            ? "رفع صور وفيديوهات ومقالات عن المدرسة والأنشطة"
            : "Upload photos, videos, and articles about school activities"
        }
      />
      <MediaUploadPanel locale={locale} />
      <DataTable
        columns={[
          { key: "filename", header: locale === "ar" ? "الملف" : "File" },
          { key: "type", header: locale === "ar" ? "النوع" : "Type" },
          { key: "size", header: locale === "ar" ? "الحجم" : "Size" },
          { key: "date", header: locale === "ar" ? "التاريخ" : "Date" },
          {
            key: "url",
            header: locale === "ar" ? "رابط" : "Link",
            render: (row) => (
              <a href={String(row.url)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                {locale === "ar" ? "فتح" : "Open"}
              </a>
            ),
          },
        ]}
        data={rows}
      />
    </div>
  );
}
