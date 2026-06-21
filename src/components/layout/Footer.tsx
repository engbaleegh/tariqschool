import Link from "next/link";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath, schoolInfo } from "@/constants/public-content";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  const quickLinks = [
    { label: t.about, href: localePath(locale, Routes.ABOUT) },
    { label: t.announcements, href: localePath(locale, Routes.ANNOUNCEMENTS) },
    { label: t.results, href: localePath(locale, Routes.RESULTS) },
    { label: t.downloads, href: localePath(locale, Routes.DOWNLOADS) },
    { label: t.calendar, href: localePath(locale, Routes.CALENDAR) },
    { label: t.faq, href: localePath(locale, Routes.FAQ) },
  ];

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container-school grid gap-8 py-12 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold text-white">
            {isAr ? schoolInfo.name.ar : schoolInfo.name.en}
          </h3>
          <p className="mt-2 text-sm">{isAr ? schoolInfo.tagline.ar : schoolInfo.tagline.en}</p>
          <p className="mt-4 text-sm">{isAr ? schoolInfo.address.ar : schoolInfo.address.en}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t.quickLinks}</h4>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">{t.contactUs}</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>{schoolInfo.phone}</li>
            <li>{schoolInfo.email}</li>
            <li>
              <Link href={localePath(locale, Routes.CONTACT)} className="hover:text-white">
                {t.sendMessage}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {isAr ? schoolInfo.name.ar : schoolInfo.name.en}. All rights reserved.
      </div>
    </footer>
  );
}
