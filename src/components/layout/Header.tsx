"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath, schoolInfo } from "@/constants/public-content";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "home", route: "" },
  { key: "about", route: Routes.ABOUT },
  { key: "announcements", route: Routes.ANNOUNCEMENTS },
  { key: "blog", route: Routes.BLOG },
  { key: "activities", route: Routes.ACTIVITIES },
  { key: "teachers", route: Routes.TEACHERS },
  { key: "gallery", route: Routes.GALLERY },
  { key: "contact", route: Routes.CONTACT },
] as const;

export default function Header({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isAr = locale === "ar";
  const otherLocale = isAr ? "en" : "ar";

  const label = (key: (typeof navLinks)[number]["key"]) =>
    t[key as keyof typeof t] as string;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="container-school flex h-16 items-center justify-between gap-4">
        <Link href={localePath(locale)} className="flex items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-800 text-sm font-bold text-white">
            ط
          </div>
          <span className="hidden max-w-[10rem] truncate text-sm font-bold text-slate-900 dark:text-white sm:inline md:max-w-xs md:text-base">
            {isAr ? schoolInfo.name.ar : schoolInfo.name.en}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map(({ key, route }) => {
            const href = localePath(locale, route);
            const active = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-slate-600 hover:text-blue-800 dark:text-slate-300 dark:hover:text-blue-300"
                )}
              >
                {label(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={localePath(locale, Routes.SEARCH)}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label={t.search}
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="hidden h-5 w-5 dark:block" />
          </button>
          <Link
            href={pathname.replace(`/${locale}`, `/${otherLocale}`)}
            className="rounded-md border border-slate-200 px-2 py-1 text-xs font-medium uppercase dark:border-slate-600"
          >
            {otherLocale}
          </Link>
          <button
            type="button"
            className="rounded-md p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-700 dark:bg-slate-900">
          <ul className="space-y-1">
            {navLinks.map(({ key, route }) => (
              <li key={key}>
                <Link
                  href={localePath(locale, route)}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {label(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
