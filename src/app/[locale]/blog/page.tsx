import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { contentDetailPath, getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContentCard } from "@/components/public/ContentCard";
import { getPublishedArticles } from "@/lib/db-content";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function BlogPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const posts = await getPublishedArticles();

  return (
    <>
      <HeroSection locale={locale} title={t.blog} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.blog}
            subtitle={locale === "ar" ? "أخبار ومقالات المدرسة" : "School news and articles"}
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((item) => (
              <ContentCard
                key={item.id}
                locale={locale}
                item={item}
                href={contentDetailPath(locale, Routes.BLOG, item)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
