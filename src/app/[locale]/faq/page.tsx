import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getFaqs } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function FaqPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const items = await getFaqs();

  return (
    <>
      <HeroSection locale={locale} title={t.faq} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading title={t.faq} />
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <details key={item.id} className="card group">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(item, "question", locale)}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {getLocalizedField(item, "answer", locale)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
