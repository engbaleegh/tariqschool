import Link from "next/link";
import type { Locale } from "@/i18n.config";
import { cn } from "@/lib/utils";
import { localePath } from "@/constants/public-content";
import { Routes } from "@/constants/enums";

type HeroSectionProps = {
  locale: Locale;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  adminHref?: string;
  coverImage?: string;
  className?: string;
  compact?: boolean;
};

export function HeroSection({
  locale,
  title,
  subtitle,
  ctaLabel,
  ctaHref = localePath(locale, Routes.ABOUT),
  adminHref,
  coverImage,
  className,
  compact = false,
}: HeroSectionProps) {
  const isAr = locale === "ar";

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white",
        compact ? "min-h-[220px] py-12 md:min-h-[260px] md:py-16" : "min-h-[360px] py-20 md:min-h-[440px] md:py-28",
        className
      )}
      style={
        coverImage
          ? {
              backgroundImage: `linear-gradient(to bottom right, rgba(30, 58, 138, 0.88), rgba(30, 64, 175, 0.82), rgba(6, 78, 59, 0.8)), url(${coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="container-school relative flex h-full items-center">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-base text-blue-100 md:mt-4 md:text-xl">{subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            {ctaLabel && (
              <Link href={ctaHref} className="btn-primary inline-flex">
                {ctaLabel}
              </Link>
            )}
            {adminHref && (
              <Link
                href={adminHref}
                className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {isAr ? "لوحة الإدارة" : "Admin Panel"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
