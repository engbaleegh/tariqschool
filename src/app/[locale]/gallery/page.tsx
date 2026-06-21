import Link from "next/link";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getGalleryAlbums } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function GalleryPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const albums = await getGalleryAlbums();

  return (
    <>
      <HeroSection locale={locale} title={t.gallery} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.gallery}
            subtitle={locale === "ar" ? "صور وألبومات المدرسة" : "School photo albums"}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={localePath(locale, `${Routes.GALLERY}/${album.slug}`)}
                className="card group overflow-hidden transition hover:shadow-lg"
              >
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-4xl">
                  📷
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white">
                    {getLocalizedField(album, "title", locale)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {album.count} {locale === "ar" ? "صورة" : "photos"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
