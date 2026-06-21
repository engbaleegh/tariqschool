import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentCard } from "@/components/public/ContentCard";
import { getPublishedEvents } from "@/lib/db-content";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ActivitiesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const activities = await getPublishedEvents();

  return (
    <>
      <HeroSection locale={locale} title={t.activities} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.activities}
            subtitle={locale === "ar" ? "الأنشطة والفعاليات المدرسية" : "School activities and events"}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.map((item) => (
              <ContentCard
                key={item.id}
                locale={locale}
                item={item}
                href={localePath(locale, `${Routes.ACTIVITIES}/${item.slug}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
