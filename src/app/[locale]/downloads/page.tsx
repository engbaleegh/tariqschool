import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getPublishedDownloads } from "@/lib/db-content";
import { getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function DownloadsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const downloads = await getPublishedDownloads();

  return (
    <>
      <HeroSection locale={locale} title={t.downloads} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading
            title={t.downloads}
            subtitle={locale === "ar" ? "نماذج ومستندات المدرسة" : "School forms and documents"}
          />
          <div className="mt-8 space-y-4">
            {downloads.map((item) => (
              <div
                key={item.id}
                className="card flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {getLocalizedField(item, "title", locale)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.type}
                    {item.size ? ` • ${item.size}` : ""}
                  </p>
                </div>
                <a
                  href={"fileUrl" in item && typeof item.fileUrl === "string" ? item.fileUrl : "#"}
                  className="btn-secondary"
                  download
                >
                  {locale === "ar" ? "تحميل" : "Download"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
