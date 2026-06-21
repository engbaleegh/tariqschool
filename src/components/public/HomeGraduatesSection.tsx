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
};

export function HomeGraduatesSection({ locale, graduates }: HomeGraduatesSectionProps) {
  const isAr = locale === "ar";
  const items = graduates.slice(0, 6);

  if (!items.length) return null;

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
            graduates.length > 6
              ? {
                  label: isAr ? "عرض الكل" : "View all",
                  href: localePath(locale, Routes.GRADUATES),
                }
              : undefined
          }
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((graduate) => {
            const name = getLocalizedField(graduate, "name", locale);
            const bio = getLocalizedField(graduate, "biography", locale);

            return (
              <article key={graduate.id} className="card flex flex-col items-center text-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-800">
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
        {graduates.length > 6 && (
          <div className="mt-8 text-center">
            <Link href={localePath(locale, Routes.GRADUATES)} className="btn-secondary inline-flex">
              {isAr ? "جميع الخريجين" : "All graduates"}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
