import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getHonorStudents } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function HonorBoardPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const students = await getHonorStudents();

  return (
    <>
      <HeroSection locale={locale} title={t.honorBoard} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading title={t.honorBoard} />
          <div className="mt-8 space-y-4">
            {students.map((student) => (
              <div key={student.id} className="card flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl">
                  🏆
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {getLocalizedField(student, "name", locale)}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {getLocalizedField(student, "grade", locale)} •{" "}
                    {getLocalizedField(student, "achievement", locale)} •{" "}
                    {student.academicYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
