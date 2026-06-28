"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Routes } from "@/constants/enums";
import { adminNavItems, getAdminNavLabel } from "@/constants/admin-nav";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
};

function adminHref(locale: string, segment?: string) {
  const base = `/${locale}/${Routes.ADMIN}`;
  return segment ? `${base}/${segment}` : base;
}

function isActive(pathname: string, href: string, segment: string) {
  if (!segment) {
    return pathname === href || pathname === `${href}/`;
  }
  return pathname.startsWith(href);
}

export default function AdminSidebar({ locale, open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const isAr = locale === "ar";

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={isAr ? "إغلاق القائمة" : "Close sidebar"}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0",
          isAr
            ? "right-0 border-l lg:translate-x-0"
            : "left-0 border-r",
          open
            ? "translate-x-0"
            : isAr
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            ط
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {isAr ? "مدرسة طارق" : "Tariq School"}
            </p>
            <p className="text-xs text-slate-500">
              {isAr ? "لوحة الإدارة" : "Admin Panel"}
            </p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const href = adminHref(locale, item.segment || undefined);
              const active = isActive(pathname, href, item.segment);
              const label = getAdminNavLabel(item, locale);

              return (
                <li key={item.segment || "dashboard"}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-current opacity-40" aria-hidden />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={isAr ? "M14 5l7 7m0 0l-7 7m7-7H3" : "M10 19l-7-7m0 0l7-7m-7 7h18"}
              />
            </svg>
            {isAr ? "عرض الموقع" : "View site"}
          </Link>
        </div>
      </aside>
    </>
  );
}

export { adminHref };
