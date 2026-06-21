import { Suspense } from "react";
import type { Locale } from "@/i18n.config";
import { HeroSection } from "@/components/public/HeroSection";
import { SignInForm } from "@/components/auth/SignInForm";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function SignInPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";

  return (
    <>
      <HeroSection
        locale={locale}
        title={isAr ? "تسجيل الدخول" : "Admin Sign In"}
        compact
      />
      <section className="section-padding">
        <div className="container-school">
          <Suspense>
            <SignInForm locale={locale} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
