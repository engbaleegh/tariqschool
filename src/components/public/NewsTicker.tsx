import type { Locale } from "@/i18n.config";
import { getLocalizedField } from "@/lib/utils";
import { stats } from "@/constants/public-content";

type NewsTickerProps = {
  locale: Locale;
  items?: { id: string; title: string; titleAr: string }[];
};

export function NewsTicker({ locale, items = [] }: NewsTickerProps) {
  const tickerItems = items.length
    ? items
    : stats.map((s, i) => ({
        id: String(i),
        title: locale === "ar" ? s.labelAr : s.labelEn,
        titleAr: s.labelAr,
      }));

  const label = locale === "ar" ? "آخر الأخبار" : "Latest News";

  return (
    <div className="bg-blue-900 text-white">
      <div className="container-school flex items-center gap-4 py-2 text-sm">
        <span className="shrink-0 rounded bg-emerald-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
        <div className="overflow-hidden">
          <div className="animate-ticker flex gap-8 whitespace-nowrap">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={`${item.id}-${i}`} className="inline-block text-sm">
                {getLocalizedField(item, "title", locale)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
