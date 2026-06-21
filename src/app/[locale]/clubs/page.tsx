import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getClubs } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ClubsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const clubs = await getClubs();

  return (
    <>
      <HeroSection locale={locale} title={t.clubs} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading title={t.clubs} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {clubs.map((club) => (
              <article key={club.id} className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(club, "name", locale)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {getLocalizedField(club, "description", locale)}
                </p>
                {"supervisor" in club && club.supervisor && (
                  <p className="mt-3 text-xs text-slate-500">
                    {locale === "ar" ? "المشرف:" : "Supervisor:"} {club.supervisor}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
