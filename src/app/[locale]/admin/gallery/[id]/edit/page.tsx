import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { GalleryAlbumForm } from "@/components/admin/GalleryAlbumForm";
import { DeleteGalleryAlbumButton } from "@/components/admin/DeleteGalleryAlbumButton";
import type { Locale } from "@/i18n.config";
import { db } from "@/lib/prisma";

type PageProps = { params: Promise<{ locale: Locale; id: string }> };

export default async function EditGalleryAlbumPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let album;
  try {
    album = await db.galleryAlbum.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    });
  } catch {
    album = null;
  }

  if (!album) notFound();

  return (
    <div>
      <PageHeader
        title={isAr ? "تعديل الألبوم" : "Edit album"}
        description={album.titleAr ?? album.title}
      />
      <div className="mb-4 flex justify-end">
        <DeleteGalleryAlbumButton albumId={id} locale={locale} />
      </div>
      <GalleryAlbumForm
        locale={locale}
        mode="edit"
        albumId={id}
        defaultValues={{
          title: album.title,
          titleAr: album.titleAr ?? undefined,
          description: album.description ?? undefined,
          descriptionAr: album.descriptionAr ?? undefined,
          category: album.category,
          coverImage: album.coverImage,
          isPublished: album.isPublished,
          order: album.order,
          images: album.images.map((img) => ({ id: img.id, url: img.url, alt: img.alt })),
        }}
      />
    </div>
  );
}
