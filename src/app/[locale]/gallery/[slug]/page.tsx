import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { galleryAlbums as placeholderAlbums, getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { getLocalizedField } from "@/lib/utils";
import { db } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export default async function GalleryAlbumPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  let title = "";
  let description = "";
  let images: { id: string; url: string; alt: string | null }[] = [];

  try {
    const album = await db.galleryAlbum.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug }, { id: slug }],
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (album) {
      title = isAr ? album.titleAr ?? album.title : album.title;
      description = isAr ? album.descriptionAr ?? album.description ?? "" : album.description ?? "";
      images = album.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: isAr ? img.altAr ?? img.alt : img.alt,
      }));
      if (!images.length && album.coverImage) {
        images = [{ id: album.id, url: album.coverImage, alt: title }];
      }
    }
  } catch {
    // fallback below
  }

  if (!title) {
    const fallback = placeholderAlbums.find((a) => a.slug === slug || a.id === slug);
    if (!fallback) notFound();
    title = getLocalizedField(fallback, "title", locale);
  }

  return (
    <>
      <HeroSection locale={locale} title={title} compact />
      <section className="section-padding">
        <div className="container-school">
          <Link
            href={localePath(locale, Routes.GALLERY)}
            className="text-sm font-medium text-blue-800 hover:underline"
          >
            ← {t.backTo} {t.gallery}
          </Link>
          {description && (
            <p className="mt-4 max-w-3xl text-slate-600">{description}</p>
          )}
          {images.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div key={img.id} className="overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt ?? title} className="h-56 w-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-slate-500">
              {isAr ? "لا توجد صور في هذا الألبوم بعد." : "No photos in this album yet."}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
