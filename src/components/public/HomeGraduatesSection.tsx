import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import type { Locale } from "@/i18n.config";
import { SectionHeading } from "@/components/public/SectionHeading";
import { localePath } from "@/constants/public-content";
import { Routes } from "@/constants/enums";
import { getLocalizedField } from "@/lib/utils";

type GraduateItem = {
  id: string;
  name: string;
  nameAr?: string | null;
  biography?: string | null;
  biographyAr?: string | null;
  photo?: string | null;
};

type HomeGraduatesSectionProps = {
  locale: Locale;
  graduates: GraduateItem[];
  totalCount: number;
};

export function HomeGraduatesSection({ locale, graduates, totalCount }: HomeGraduatesSectionProps) {
  const isAr = locale === "ar";

  if (!graduates.length) return null;

  return (
    <section className="section-padding">
      <div className="container-school">
        <SectionHeading
          title={isAr ? "خريجونا" : "Our Graduates"}
          subtitle={
            isAr
              ? "نفخر بإنجازات خريجي مجمع طارق بن زياد"
              : "We are proud of our school graduates"
          }
          action={
            totalCount > graduates.length
              ? {
                  label: isAr ? "عرض الكل" : "View all",
                  href: localePath(locale, Routes.GRADUATES),
                }
              : undefined
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {graduates.map((graduate) => {
            const name = getLocalizedField(graduate, "name", locale);
            const bio = getLocalizedField(graduate, "biography", locale);

            return (
              <article
                key={graduate.id}
                className="home-card flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-emerald-50 text-blue-800 ring-2 ring-blue-100">
                  {graduate.photo ? (
                    <Image
                      src={graduate.photo}
                      alt={name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <User className="h-10 w-10" aria-hidden />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{name}</h3>
                {bio && (
                  <p className="mt-2 line-clamp-4 text-sm text-slate-600 dark:text-slate-300">{bio}</p>
                )}
              </article>
            );
          })}
        </div>
        {totalCount > graduates.length && (
          <div className="mt-8 text-center">
            <Link href={localePath(locale, Routes.GRADUATES)} className="btn-secondary inline-flex">
              {isAr ? "عرض جميع الخريجين" : "View all graduates"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
