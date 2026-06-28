"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Home,
  Images,
  Mail,
  Megaphone,
  Settings,
  Shield,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Routes } from "@/constants/enums";
import { adminNavItems, getAdminNavLabel } from "@/constants/admin-nav";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
};

const segmentIcons: Record<string, LucideIcon> = {
  "": Home,
  homepage: Home,
  [Routes.TEACHERS]: Users,
  [Routes.GRADUATES]: GraduationCap,
  [Routes.ANNOUNCEMENTS]: Megaphone,
  articles: BookOpen,
  events: Calendar,
  [Routes.GALLERY]: Images,
  [Routes.RESULTS]: BarChart3,
  [Routes.DOWNLOADS]: Download,
  [Routes.CALENDAR]: Calendar,
  media: Images,
  users: Shield,
  messages: Mail,
  "audit-logs": FileText,
  settings: Settings,
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
          isAr ? "right-0 border-l lg:translate-x-0" : "left-0 border-r",
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
            <p className="text-xs text-slate-500">{isAr ? "لوحة الإدارة" : "Admin Panel"}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const href = adminHref(locale, item.segment || undefined);
              const active = isActive(pathname, href, item.segment);
              const label = getAdminNavLabel(item, locale);
              const Icon = segmentIcons[item.segment] ?? FileText;

              return (
                <li key={item.segment || "dashboard"}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                        active
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:scale-105 group-hover:bg-indigo-100 group-hover:text-indigo-700"
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="space-y-2 border-t border-slate-200 p-4">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Home className="h-4 w-4" aria-hidden />
            {isAr ? "عرض الموقع" : "View site"}
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: `/${locale}/auth/signin` })}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isAr ? "تسجيل الخروج" : "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}

export { adminHref };
