import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n.config";
import { HeroSection } from "@/components/public/HeroSection";
import { blogPosts as placeholderPosts, getTranslations, localePath } from "@/constants/public-content";
import { Routes } from "@/constants/enums";
import { formatDate, getLocalizedField, decodeRouteParam } from "@/lib/utils";
import { db } from "@/lib/prisma";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug: rawSlug } = await params;
  const slug = decodeRouteParam(rawSlug);
  const typedLocale = locale as Locale;
  const t = getTranslations(typedLocale);
  const isAr = typedLocale === "ar";

  let title = "";
  let content = "";
  let date = "";
  let featuredImage: string | null = null;

  try {
    const item = await db.article.findFirst({
      where: {
        isPublished: true,
        OR: [{ slug }, { id: slug }],
      },
    });
    if (item) {
      title = isAr ? item.titleAr ?? item.title : item.title;
      content = isAr ? item.contentAr ?? item.content : item.content;
      date = item.publishedAt?.toISOString().split("T")[0] ?? "";
      featuredImage = item.featuredImage;
    }
  } catch {
    // fallback below
  }

  if (!title) {
    const fallback = placeholderPosts.find((p) => p.slug === slug || p.id === slug);
    if (!fallback) notFound();
    title = getLocalizedField(fallback, "title", locale);
    content = getLocalizedField(fallback, "excerpt", locale);
    date = fallback.date;
  }

  return (
    <>
      <HeroSection locale={typedLocale} title={title} compact />
      <section className="section-padding">
        <div className="container-school">
          <div className="mx-auto max-w-3xl">
            {date && (
              <time dateTime={date} className="text-sm text-slate-500">
                {formatDate(date, locale)}
              </time>
            )}
          </div>

          {featuredImage && (
            <figure className="mx-auto mt-6 max-w-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredImage} alt={title} className="blog-featured-image" loading="eager" />
            </figure>
          )}

          <div className="prose-school mx-auto mt-6 max-w-3xl whitespace-pre-wrap">{content}</div>

          <div className="mx-auto max-w-3xl">
            <Link
              href={localePath(typedLocale, Routes.BLOG)}
              className="mt-8 inline-flex text-sm font-medium text-blue-800 hover:underline"
            >
              ← {t.backTo} {t.blog}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
