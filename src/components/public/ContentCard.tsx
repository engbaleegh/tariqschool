import Link from "next/link";
import type { Locale } from "@/i18n.config";
import { cn, formatDate, getLocalizedField } from "@/lib/utils";
import { getTranslations, type LocalizedItem } from "@/constants/public-content";

type ContentCardProps = {
  locale: Locale;
  item: LocalizedItem;
  href: string;
  className?: string;
};

export function ContentCard({ locale, item, href, className }: ContentCardProps) {
  const t = getTranslations(locale);
  const title = getLocalizedField(item, "title", locale);
  const excerpt = getLocalizedField(item, "excerpt", locale);
  const category = item.category
    ? getLocalizedField(item, "category", locale)
    : null;

  return (
    <article
      className={cn(
        "card-school group flex flex-col transition-shadow hover:shadow-lg",
        className
      )}
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-sm text-school-slate-500">
          <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
          {category && (
            <>
              <span aria-hidden>•</span>
              <span className="rounded-full bg-school-emerald-50 px-2 py-0.5 text-xs font-medium text-school-emerald-700">
                {category}
              </span>
            </>
          )}
        </div>
        <h3 className="text-lg font-semibold text-school-blue-900 group-hover:text-school-emerald-700">
          <Link href={href} className="hover:underline">
            {title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-school-slate-600 line-clamp-3">
          {excerpt}
        </p>
        <Link
          href={href}
          className="mt-4 inline-flex items-center text-sm font-medium text-school-blue-700 hover:text-school-emerald-600"
        >
          {t.readMore}
          <span className="ms-1" aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
