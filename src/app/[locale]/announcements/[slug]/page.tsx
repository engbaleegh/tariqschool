import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { formatDate, getLocalizedField, decodeRouteParam } from "@/lib/utils";
import { HeroSection } from "@/components/public/HeroSection";
import { getPublishedAnnouncements } from "@/lib/db-content";
import { db } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeRouteParam(rawSlug);
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  let title = "";
  let content = "";
  let date = "";

  try {
    const item = await db.announcement.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug }, { id: slug }],
      },
    });
    if (item) {
      title = isAr ? item.titleAr ?? item.title : item.title;
      content = isAr ? item.contentAr ?? item.content : item.content;
      date = item.publishedAt?.toISOString().split("T")[0] ?? item.createdAt.toISOString().split("T")[0];
    }
  } catch {
    // fallback below
  }

  if (!title) {
    const announcements = await getPublishedAnnouncements();
    const fallback = announcements.find((a) => a.slug === slug || a.id === slug);
    if (!fallback) notFound();
    title = getLocalizedField(fallback, "title", locale);
    content = getLocalizedField(fallback, "excerpt", locale);
    date = fallback.date;
  }

  return (
    <>
      <HeroSection locale={locale} title={title} compact />
      <article className="section-padding">
        <div className="container-school max-w-3xl">
          <Link
            href={localePath(locale, Routes.ANNOUNCEMENTS)}
            className="text-sm font-medium text-school-blue-700 hover:text-school-emerald-600"
          >
            ← {t.backTo} {t.announcements}
          </Link>
          {date && (
            <time dateTime={date} className="mt-4 block text-sm text-school-slate-500">
              {formatDate(date, locale)}
            </time>
          )}
          <div className="prose-school mt-6 whitespace-pre-wrap text-school-slate-700">
            {content}
          </div>
        </div>
      </article>
    </>
  );
}
