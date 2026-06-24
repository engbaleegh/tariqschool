import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { activities as placeholderActivities, getTranslations, localePath } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { formatDate, getLocalizedField } from "@/lib/utils";
import { db } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function parseImageUrls(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter((item): item is string => typeof item === "string");
  }
  return [];
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  let title = "";
  let content = "";
  let date = "";
  let imageUrls: string[] = [];

  try {
    const event = await db.event.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug }, { id: slug }],
      },
    });
    if (event) {
      title = isAr ? event.titleAr ?? event.title : event.title;
      content = isAr ? event.descriptionAr ?? event.description : event.description;
      date = event.eventDate.toISOString().split("T")[0];
      imageUrls = parseImageUrls(event.images);
    }
  } catch {
    // fallback below
  }

  if (!title) {
    const fallback = placeholderActivities.find((a) => a.slug === slug || a.id === slug);
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
          {imageUrls.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {imageUrls.map((url) => (
                <div key={url} className="overflow-hidden rounded-xl border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={title} className="h-48 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
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
