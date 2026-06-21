import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { formatDate, getLocalizedField } from "@/lib/utils";
import { getPublishedEvents } from "@/lib/db-content";
import { db } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export default async function ActivityDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  let title = "";
  let content = "";
  let date = "";

  try {
    const event = await db.event.findFirst({ where: { slug, isPublished: true } });
    if (event) {
      title = isAr ? event.titleAr ?? event.title : event.title;
      content = isAr ? event.descriptionAr ?? event.description : event.description;
      date = event.eventDate.toISOString().split("T")[0];
    }
  } catch {
    // fallback below
  }

  if (!title) {
    const activities = await getPublishedEvents();
    const fallback = activities.find((a) => a.slug === slug);
    if (!fallback) notFound();
    title = getLocalizedField(fallback, "title", locale);
    content = getLocalizedField(fallback, "excerpt", locale);
    date = fallback.date;
  }

  return (
    <>
      <HeroSection locale={locale} title={title} compact />
      <section className="section-padding">
        <div className="container-school max-w-3xl">
          {date && (
            <time dateTime={date} className="text-sm text-slate-500">
              {formatDate(date, locale)}
            </time>
          )}
          <div className="prose-school mt-6 whitespace-pre-wrap">{content}</div>
          <Link
            href={localePath(locale, Routes.ACTIVITIES)}
            className="mt-8 inline-flex text-sm font-medium text-blue-800 hover:underline"
          >
            ← {t.backTo} {t.activities}
          </Link>
        </div>
      </section>
    </>
  );
}
