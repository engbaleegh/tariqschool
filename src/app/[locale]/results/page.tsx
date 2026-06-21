import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ResultsList } from "@/components/public/ResultsList";
import { getPublishedResults } from "@/lib/db-content";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ResultsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const results = await getPublishedResults();

  return (
    <>
      <HeroSection locale={locale} title={t.results} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading
            title={t.results}
            subtitle={
              locale === "ar"
                ? "نتائج المدرسة المنشورة — ملفات PDF وصور"
                : "Published school results — PDF files and images"
            }
          />
          <div className="mt-8">
            <ResultsList locale={locale} results={results} />
          </div>
        </div>
      </section>
    </>
  );
}
