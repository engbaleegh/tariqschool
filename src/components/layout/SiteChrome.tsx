"use client";

import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n.config";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";

type SiteChromeProps = {
  locale: Locale;
  children: React.ReactNode;
};

export function SiteChrome({ locale, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <WhatsAppButton locale={locale} />
    </>
  );
}
