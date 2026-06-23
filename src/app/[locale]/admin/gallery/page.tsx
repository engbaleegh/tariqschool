import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import DataTable from "@/components/admin/DataTable";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";
import { getLocalizedField } from "@/lib/utils";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function AdminGalleryPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const base = `/${locale}/admin/gallery`;

  let rows: { id: string; title: string; category: string; status: string; count: number }[] = [];
  try {
    const items = await db.galleryAlbum.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { images: true } } },
    });
    rows = items.map((item) => ({
      id: item.id,
      title: getLocalizedField(item, "title", locale),
      category: item.category,
      status: item.isPublished ? (isAr ? "منشور" : "Published") : isAr ? "مخفي" : "Hidden",
      count: item._count.images,
    }));
  } catch {
    rows = [];
  }

  return (
    <div>
      <PageHeader
        title={isAr ? "المعرض" : "Gallery"}
        description={
          isAr
            ? "إدارة ألبومات الصور — جميع الملفات تُخزَّن في Vercel Blob"
            : "Manage photo albums — all files stored in Vercel Blob"
        }
        action={{ label: isAr ? "ألبوم جديد" : "New album", href: `${base}/new` }}
      />
      <DataTable
        locale={locale}
        columns={[
          { key: "title", header: isAr ? "الألبوم" : "Album", className: "w-[30%]" },
          { key: "category", header: isAr ? "التصنيف" : "Category", className: "w-[18%]" },
          { key: "count", header: isAr ? "الصور" : "Images", className: "w-[10%]" },
          { key: "status", header: isAr ? "الحالة" : "Status", className: "w-[12%]" },
          {
            key: "actions",
            header: isAr ? "إجراءات" : "Actions",
            className: "w-[15%]",
            sortable: false,
            render: (row) => (
              <Link
                href={`${base}/${row.id}/edit`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
              >
                {isAr ? "تعديل" : "Edit"}
              </Link>
            ),
          },
        ]}
        data={rows}
        emptyMessage={isAr ? "لا توجد ألبومات بعد" : "No albums yet"}
      />
    </div>
  );
}
