import type { Locale } from "@/i18n.config";
import { stats } from "@/constants/public-content";

type StatsSectionProps = {
  locale: Locale;
};

export function StatsSection({ locale }: StatsSectionProps) {
  return (
    <section className="bg-blue-50 py-10 md:py-12">
      <div className="container-school">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-blue-100 md:p-6"
            >
              <p className="text-2xl font-bold text-emerald-600 md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-600 md:mt-2 md:text-sm">
                {locale === "ar" ? stat.labelAr : stat.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
