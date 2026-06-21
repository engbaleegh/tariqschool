import type { Locale } from "@/i18n.config";
import { Languages } from "@/constants/enums";
import { schoolInfo } from "@/constants/public-content";
import { HeroSection } from "@/components/public/HeroSection";
import { SectionHeading } from "@/components/public/SectionHeading";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === Languages.ARABIC;

  return (
    <>
      <HeroSection
        locale={locale}
        title={isAr ? "عن المدرسة" : "About Our School"}
        subtitle={isAr ? schoolInfo.tagline.ar : schoolInfo.tagline.en}
        compact
      />
      <section className="py-16">
        <div className="container-school max-w-4xl">
          <SectionHeading
            title={isAr ? "رؤيتنا ورسالتنا" : "Our Vision & Mission"}
          />
          <div className="prose-school space-y-6 text-school-slate-700">
            <p>
              {isAr
                ? "يسعى مجمع طارق بن زياد المقاطن إلى تقديم تعليم متميز منذ ٥٦ عاماً، مع التركيز على بناء شخصية الطالب المتكاملة وتنمية مهاراته الأكاديمية والاجتماعية."
                : "Tariq Bin Ziyad Al-Maqatin School has provided exceptional education for 56 years, focusing on developing well-rounded students with strong academic and social skills."}
            </p>
            <p>
              {isAr
                ? "نؤمن بأن كل طالب يمتلك إمكانات فريدة، ونعمل على اكتشافها وتنميتها من خلال بيئة تعليمية محفزة وداعمة."
                : "We believe every student has unique potential, and we work to discover and nurture it through a stimulating and supportive learning environment."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
