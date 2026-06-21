import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentCard } from "@/components/public/ContentCard";
import { getPublishedAnnouncements } from "@/lib/db-content";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AnnouncementsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const announcements = await getPublishedAnnouncements();

  return (
    <>
      <HeroSection locale={locale} title={t.announcements} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.latestAnnouncements}
            subtitle={locale === "ar" ? "آخر الأخبار والإعلانات المدرسية" : "Latest school news and announcements"}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {announcements.map((item) => (
              <ContentCard
                key={item.id}
                locale={locale}
                item={item}
                href={localePath(locale, `${Routes.ANNOUNCEMENTS}/${item.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
