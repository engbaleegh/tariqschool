import Image from "next/image";
import { User } from "lucide-react";
import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getActiveTeachers } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function TeachersPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const teachers = await getActiveTeachers();

  return (
    <>
      <HeroSection locale={locale} title={t.teachers} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading
            title={t.teachers}
            subtitle={locale === "ar" ? "تعرف على كادرنا التعليمي" : "Meet our teaching staff"}
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => {
              const name = getLocalizedField(teacher, "name", locale);
              const hasPhoto = "photo" in teacher && typeof teacher.photo === "string" && teacher.photo;

              return (
                <article key={teacher.id} className="card text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-800">
                    {hasPhoto ? (
                      <Image
                        src={teacher.photo as string}
                        alt={name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="h-10 w-10" aria-hidden />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h3>
                  <p className="mt-1 text-sm text-blue-700">
                    {getLocalizedField(teacher, "subject", locale)}
                  </p>
                  {"department" in teacher && teacher.department && (
                    <p className="mt-1 text-xs text-slate-500">
                      {getLocalizedField(teacher as Record<string, unknown>, "department", locale)}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
