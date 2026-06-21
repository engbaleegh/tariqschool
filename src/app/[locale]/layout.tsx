import type { Metadata } from "next";
import type { Locale } from "@/i18n.config";
import { Languages, Directions } from "@/constants/enums";
import { i18n } from "@/i18n.config";
import { schoolInfo } from "@/constants/public-content";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import NextAuthSessionProvider from "@/providers/SessionProvider";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === Languages.ARABIC;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return {
    title: {
      default: isAr ? `${schoolInfo.name.ar} | الموقع الرسمي` : `${schoolInfo.name.en} | Official Website`,
      template: isAr ? `%s | ${schoolInfo.name.ar}` : `%s | ${schoolInfo.name.en}`,
    },
    description: isAr ? schoolInfo.tagline.ar : schoolInfo.tagline.en,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: isAr ? schoolInfo.name.ar : schoolInfo.name.en,
      description: isAr ? schoolInfo.tagline.ar : schoolInfo.tagline.en,
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  return (
    <div lang={locale} dir={locale === Languages.ARABIC ? Directions.RTL : Directions.LTR}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "School",
            name: locale === "ar" ? schoolInfo.name.ar : schoolInfo.name.en,
            url: process.env.NEXT_PUBLIC_BASE_URL,
            telephone: schoolInfo.phone,
            email: schoolInfo.email,
          }),
        }}
      />
      <NextAuthSessionProvider>
        <ThemeProvider>
          <SiteChrome locale={typedLocale}>{children}</SiteChrome>
        </ThemeProvider>
      </NextAuthSessionProvider>
    </div>
  );
}
