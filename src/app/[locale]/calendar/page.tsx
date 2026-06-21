import type { Locale } from "@/i18n.config";
import { getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { getCalendarEvents } from "@/lib/db-content";
import { formatDate, getLocalizedField } from "@/lib/utils";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function CalendarPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const events = await getCalendarEvents();

  return (
    <>
      <HeroSection locale={locale} title={t.calendar} compact />
      <section className="section-padding">
        <div className="container-school max-w-4xl">
          <SectionHeading
            title={t.calendar}
            subtitle={locale === "ar" ? "التقويم الأكاديمي والفعاليات" : "Academic calendar and events"}
          />
          <div className="mt-8 space-y-4">
            {events.map((event) => (
              <div key={event.id} className="card flex gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-800 text-white">
                  <span className="text-xs font-medium">
                    {new Date(event.startDate).toLocaleDateString(locale, { month: "short" })}
                  </span>
                  <span className="text-lg font-bold">
                    {new Date(event.startDate).getDate()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {getLocalizedField(event, "title", locale)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(event.startDate, locale)}
                    {"type" in event && event.type ? ` • ${event.type}` : ""}
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
