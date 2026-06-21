import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getRegulations } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function RegulationsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const items = await getRegulations();

  return (
    <>
      <HeroSection locale={locale} title={t.regulations} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading title={t.regulations} />
          <div className="mt-8 space-y-6">
            {items.map((item) => (
              <article key={item.id} className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(item, "title", locale)}
                </h3>
                <p className="mt-3 text-slate-600">{getLocalizedField(item, "content", locale)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
