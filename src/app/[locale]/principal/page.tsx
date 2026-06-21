import type { Locale } from "@/i18n.config";
import { principalMessage, getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function PrincipalPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  return (
    <>
      <HeroSection locale={locale} title={t.principal} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <div className="card flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-blue-100 text-4xl">
              👨‍🏫
            </div>
            <div>
              <SectionHeading
                title={isAr ? principalMessage.name.ar : principalMessage.name.en}
                subtitle={isAr ? principalMessage.title.ar : principalMessage.title.en}
              />
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                {isAr ? principalMessage.message.ar : principalMessage.message.en}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
