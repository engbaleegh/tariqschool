import Link from "next/link";
import type { Locale } from "@/i18n.config";
import { Routes } from "@/constants/enums";
import { getTranslations, localePath, schoolInfo } from "@/constants/public-content";

const DEVELOPER_WHATSAPP = "967773408338";

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
                <Link href={link.href} className="text-sm transition-colors duration-200 hover:translate-x-0.5 hover:text-white">
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
        <p>
          © {new Date().getFullYear()} {isAr ? schoolInfo.name.ar : schoolInfo.name.en}. All rights reserved.
        </p>
        <p className="mt-2 flex items-center justify-center gap-2 text-slate-400">
          <span>{isAr ? "الموقع بواسطة" : "Site by"} Eng: Baleegh Alsoriehy</span>
          <a
            href={`https://wa.me/${DEVELOPER_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 p-1.5 text-white transition-colors hover:bg-emerald-500"
            aria-label={isAr ? "تواصل مع المطور عبر واتساب" : "Contact developer on WhatsApp"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </p>
      </div>
    </footer>
  );
}
