import type { Locale } from "@/i18n.config";
import { schoolInfo, getTranslations } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ContactForm } from "@/components/public/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = getTranslations(locale);
  const isAr = locale === "ar";

  return (
    <>
      <HeroSection locale={locale} title={t.contactUs} compact />
      <section className="section-padding">
        <div className="container-school">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionHeading title={t.contactUs} />
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-blue-800" />
                  <span className="text-slate-600">
                    {isAr ? schoolInfo.address.ar : schoolInfo.address.en}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-blue-800" />
                  <a href={`tel:${schoolInfo.phone}`} className="text-slate-600 hover:text-blue-800">
                    {schoolInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-800" />
                  <a href={`mailto:${schoolInfo.email}`} className="text-slate-600 hover:text-blue-800">
                    {schoolInfo.email}
                  </a>
                </li>
              </ul>
            </div>
            <ContactForm locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
