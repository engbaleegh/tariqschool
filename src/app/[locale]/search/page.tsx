import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { contentDetailPath, getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SearchBar } from "@/components/public/SearchBar";
import { ContentCard } from "@/components/public/ContentCard";
import { db } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  const t = getTranslations(locale);
  const query = q.trim();

  type ResultItem = {
    id: string;
    slug: string;
    title: string;
    titleAr: string;
    excerpt: string;
    excerptAr: string;
    date: string;
    type: "announcement" | "article";
  };

  let results: ResultItem[] = [];

  if (query.length >= 2) {
    try {
      const [announcements, articles] = await Promise.all([
        db.announcement.findMany({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { titleAr: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 10,
        }),
        db.article.findMany({
          where: {
            isPublished: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { titleAr: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 10,
        }),
      ]);

      results = [
        ...announcements.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          titleAr: row.titleAr ?? row.title,
          excerpt: row.excerpt ?? row.content.slice(0, 120),
          excerptAr: row.excerptAr ?? "",
          date: row.publishedAt?.toISOString().split("T")[0] ?? "",
          type: "announcement" as const,
        })),
        ...articles.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          titleAr: row.titleAr ?? row.title,
          excerpt: row.excerpt ?? row.content.slice(0, 120),
          excerptAr: row.excerptAr ?? "",
          date: row.publishedAt?.toISOString().split("T")[0] ?? "",
          type: "article" as const,
        })),
      ];
    } catch {
      results = [];
    }
  }

  return (
    <>
      <HeroSection locale={locale} title={t.search} compact />
      <section className="section-padding">
        <div className="container-school max-w-3xl">
          <SearchBar locale={locale} defaultValue={query} className="mb-8" />
          {query && (
            <>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {t.searchResults}
                {results.length > 0 && ` (${results.length})`}
              </h2>
              {results.length === 0 ? (
                <p className="mt-4 text-slate-600">{t.noResults}</p>
              ) : (
                <div className="mt-6 grid gap-4">
                  {results.map((item) => (
                    <ContentCard
                      key={`${item.type}-${item.id}`}
                      locale={locale}
                      item={item}
                      href={contentDetailPath(
                        locale,
                        item.type === "announcement" ? Routes.ANNOUNCEMENTS : Routes.BLOG,
                        item
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
