import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getParentResources } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ParentResourcesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const resources = await getParentResources();

  return (
    <>
      <HeroSection locale={locale} title={t.parentResources} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading title={t.parentResources} />
          <div className="mt-8 space-y-4">
            {resources.map((item) => (
              <div key={item.id} className="card flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {getLocalizedField(item, "title", locale)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {getLocalizedField(item, "description", locale)}
                  </p>
                </div>
                {("fileUrl" in item && item.fileUrl) || ("link" in item && item.link) ? (
                  <a
                    href={("fileUrl" in item && item.fileUrl) || ("link" in item && item.link) || "#"}
                    className="btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locale === "ar" ? "فتح" : "Open"}
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
