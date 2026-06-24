import PageHeader from "@/components/admin/PageHeader";
import { GalleryAdminTable } from "@/components/admin/tables/GalleryAdminTable";
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
      <GalleryAdminTable
        locale={locale}
        base={base}
        data={rows}
        emptyMessage={isAr ? "لا توجد ألبومات بعد" : "No albums yet"}
      />
    </div>
  );
}
