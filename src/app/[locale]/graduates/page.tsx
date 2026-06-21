import Image from "next/image";
import { User } from "lucide-react";
import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getActiveGraduates } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function GraduatesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const graduates = await getActiveGraduates();
  const isAr = locale === "ar";

  return (
    <>
      <HeroSection locale={locale} title={t.graduates} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={isAr ? "خريجونا" : "Our Graduates"}
            subtitle={
              isAr
                ? "تعرف على خريجي مجمع طارق بن زياد المقاطن"
                : "Meet graduates of Tariq Bin Ziyad Al-Maqatin School"
            }
          />
          {graduates.length === 0 ? (
            <p className="mt-8 text-center text-slate-500">
              {isAr ? "لا يوجد خريجون معروضون حالياً" : "No graduates to display yet"}
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {graduates.map((graduate) => {
                const name = getLocalizedField(graduate, "name", locale);
                const bio = getLocalizedField(graduate, "biography", locale);

                return (
                  <article key={graduate.id} className="card text-center">
                    <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-800">
                      {graduate.photo ? (
                        <Image
                          src={graduate.photo}
                          alt={name}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="h-12 w-12" aria-hidden />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h3>
                    {bio && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{bio}</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
