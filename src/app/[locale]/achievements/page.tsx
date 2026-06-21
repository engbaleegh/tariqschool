import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getAchievements } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AchievementsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const items = await getAchievements();

  return (
    <>
      <HeroSection locale={locale} title={t.achievements} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading title={t.achievements} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="card">
                {"year" in item && item.year && (
                  <span className="text-sm font-medium text-blue-700">{item.year}</span>
                )}
                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(item, "title", locale)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {getLocalizedField(item, "description", locale)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
