import { Sparkles } from "lucide-react";
import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getSchoolServices } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const services = await getSchoolServices();

  return (
    <>
      <HeroSection locale={locale} title={t.services} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading title={t.services} />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card text-center">
                <span
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-800"
                  aria-hidden
                >
                  {"icon" in service && service.icon ? (
                    <span className="text-lg leading-none">{service.icon}</span>
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(service, "name", locale)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {getLocalizedField(service, "description", locale)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
