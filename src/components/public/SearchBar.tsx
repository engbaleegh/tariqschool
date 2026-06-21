import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath } from "@/constants/public-content";
import { InputTypes } from "@/constants/enums";

type SearchBarProps = {
  locale: Locale;
  defaultValue?: string;
  className?: string;
};

export function SearchBar({ locale, defaultValue = "", className }: SearchBarProps) {
  const t = getTranslations(locale);

  return (
    <form
      action={localePath(locale, Routes.SEARCH)}
      method="GET"
      className={className}
      role="search"
    >
      <div className="flex gap-2">
        <input
          type={InputTypes.SEARCH}
          name="q"
          defaultValue={defaultValue}
          placeholder={t.searchPlaceholder}
          className="input-school flex-1"
          aria-label={t.search}
        />
        <button type="submit" className="btn-primary shrink-0">
          {t.search}
        </button>
      </div>
    </form>
  );
}
