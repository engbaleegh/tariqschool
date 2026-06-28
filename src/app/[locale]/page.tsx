import {
  BarChart3,
  Download,
  Calendar,
  GraduationCap,
  Images,
  Mail,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n.config";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentCard } from "@/components/public/ContentCard";
import { StatsSection } from "@/components/public/StatsSection";
import { NewsTicker } from "@/components/public/NewsTicker";
import {
  getTranslations,
  localePath,
  contentDetailPath,
  schoolInfo,
} from "@/constants/public-content";
import { Routes } from "@/constants/enums";
import {
  getPublishedAnnouncements,
  getPublishedEvents,
  getPublishedResults,
  getHomepageGraduates,
  getActiveGraduateCount,
} from "@/lib/db-content";
import { getHeroCoverImage } from "@/lib/school-settings";
import { HomeResultsSection } from "@/components/public/ResultsList";
import { HomeGraduatesSection } from "@/components/public/HomeGraduatesSection";
import { QuickLinkCard } from "@/components/public/QuickLinkCard";

const quickLinkIcons: Record<string, LucideIcon> = {
  results: BarChart3,
  downloads: Download,
  calendar: Calendar,
  teachers: GraduationCap,
  gallery: Images,
  contact: Mail,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = locale === "ar";

  const [dbAnnouncements, dbEvents, coverImage, publishedResults, homepageGraduates, graduateCount] =
    await Promise.all([
      getPublishedAnnouncements(),
      getPublishedEvents(),
      getHeroCoverImage(),
      getPublishedResults(),
      getHomepageGraduates(),
      getActiveGraduateCount(),
    ]);

  const quickLinks = [
    { key: "results", label: t.results, href: localePath(typedLocale, Routes.RESULTS) },
    { key: "downloads", label: t.downloads, href: localePath(typedLocale, Routes.DOWNLOADS) },
    { key: "calendar", label: t.calendar, href: localePath(typedLocale, Routes.CALENDAR) },
    { key: "teachers", label: t.teachers, href: localePath(typedLocale, Routes.TEACHERS) },
    { key: "gallery", label: t.gallery, href: localePath(typedLocale, Routes.GALLERY) },
    { key: "contact", label: t.contact, href: localePath(typedLocale, Routes.CONTACT) },
  ] as const;

  return (
    <>
      <HeroSection
        locale={typedLocale}
        title={isAr ? schoolInfo.name.ar : schoolInfo.name.en}
        subtitle={isAr ? schoolInfo.tagline.ar : schoolInfo.tagline.en}
        ctaLabel={t.about}
        ctaHref={localePath(typedLocale, Routes.ABOUT)}
        adminHref={localePath(typedLocale, Routes.ADMIN)}
        coverImage={coverImage}
      />

      <NewsTicker locale={typedLocale} items={dbAnnouncements} />

      <StatsSection locale={typedLocale} />

      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="container-school">
          <SectionHeading
            title={t.latestAnnouncements}
            action={{ label: t.viewAll, href: localePath(typedLocale, Routes.ANNOUNCEMENTS) }}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {dbAnnouncements.slice(0, 3).map((item) => (
              <ContentCard
                key={item.id}
                locale={typedLocale}
                item={item}
                href={contentDetailPath(typedLocale, Routes.ANNOUNCEMENTS, item)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.upcomingEvents}
            action={{ label: t.viewAll, href: localePath(typedLocale, Routes.ACTIVITIES) }}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dbEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="card flex gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-800 text-white">
                  <span className="text-xs font-medium">
                    {new Date(event.date).toLocaleDateString(locale, { month: "short" })}
                  </span>
                  <span className="text-lg font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {isAr ? event.titleAr : event.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {isAr ? event.excerptAr : event.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-slate-50 dark:bg-slate-900/50">
        <div className="container-school">
          <SectionHeading title={t.quickLinks} />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {quickLinks.map((link) => {
              const Icon = quickLinkIcons[link.key];
              return <QuickLinkCard key={link.href} href={link.href} label={link.label} icon={Icon} />;
            })}
          </div>
        </div>
      </section>

      <HomeResultsSection
        locale={typedLocale}
        results={publishedResults}
        viewAllHref={localePath(typedLocale, Routes.RESULTS)}
      />

      <HomeGraduatesSection
        locale={typedLocale}
        graduates={homepageGraduates}
        totalCount={graduateCount}
      />

      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={isAr ? "أحدث الأنشطة" : "Latest Activities"}
            action={{ label: t.viewAll, href: localePath(typedLocale, Routes.ACTIVITIES) }}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {dbEvents.slice(0, 2).map((item) => (
              <ContentCard
                key={item.id}
                locale={typedLocale}
                item={item}
                href={contentDetailPath(typedLocale, Routes.ACTIVITIES, item)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
