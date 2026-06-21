import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getDepartments } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function DepartmentsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const departments = await getDepartments();

  return (
    <>
      <HeroSection locale={locale} title={t.departments} compact />
      <section className="section-padding">
        <div className="container-school">
          <SectionHeading title={t.departments} />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {departments.map((dept) => (
              <article key={dept.id} className="card">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {getLocalizedField(dept, "name", locale)}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {getLocalizedField(dept, "description", locale)}
                </p>
                {"headName" in dept && dept.headName && (
                  <p className="mt-3 text-xs font-medium text-blue-700">
                    {locale === "ar" ? "رئيس القسم:" : "Head:"}{" "}
                    {getLocalizedField(dept as Record<string, unknown>, "headName", locale)}
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
