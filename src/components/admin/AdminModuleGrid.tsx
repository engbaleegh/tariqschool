"use client";

import Link from "next/link";
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

type AdminModuleGridProps = {
  locale: string;
};

export function AdminModuleGrid({ locale }: AdminModuleGridProps) {
  const isAr = locale === "ar";
  const base = `/${locale}/${Routes.ADMIN}`;
  const items = adminNavItems.filter((item) => item.segment !== "");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-900">
        {isAr ? "أقسام لوحة التحكم" : "Admin sections"}
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = segmentIcons[item.segment] ?? FileText;
          const href = `${base}/${item.segment}`;
          const label = getAdminNavLabel(item, locale);

          return (
            <Link key={item.segment} href={href} className="admin-module-card group">
              <span className="admin-module-icon">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-center text-xs font-medium leading-snug sm:text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
