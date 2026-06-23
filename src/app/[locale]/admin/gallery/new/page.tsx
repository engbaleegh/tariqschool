import PageHeader from "@/components/admin/PageHeader";
import { GalleryAlbumForm } from "@/components/admin/GalleryAlbumForm";
import type { Locale } from "@/i18n.config";

type PageProps = { params: Promise<{ locale: Locale }> };

export default async function NewGalleryAlbumPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <div>
      <PageHeader
        title={isAr ? "ألبوم جديد" : "New album"}
        description={isAr ? "ارفع صوراً متعددة — تُحفظ في Vercel Blob" : "Upload multiple images — stored in Vercel Blob"}
      />
      <GalleryAlbumForm locale={locale} mode="create" />
    </div>
  );
}
