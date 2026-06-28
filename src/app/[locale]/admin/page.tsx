import Link from "next/link";
import { FileText, Users, Calendar, Mail, Megaphone } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import { Routes } from "@/constants/enums";
import type { Locale } from "@/i18n.config";
import { getAdminStats } from "@/lib/db-content";

type AdminDashboardProps = {
  params: Promise<{ locale: Locale }>;
};

export default async function AdminDashboardPage({ params }: AdminDashboardProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const adminBase = `/${locale}/${Routes.ADMIN}`;
  const stats = await getAdminStats();

  const statCards = [
    {
      title: isAr ? "المقالات" : "Articles",
      value: stats.articles,
      changeType: "neutral" as const,
      icon: <FileText className="h-5 w-5" />,
      href: `${adminBase}/articles`,
    },
    {
      title: isAr ? "الإعلانات" : "Announcements",
      value: stats.announcements,
      changeType: "neutral" as const,
      icon: <Megaphone className="h-5 w-5" />,
      href: `${adminBase}/${Routes.ANNOUNCEMENTS}`,
    },
    {
      title: isAr ? "المعلمون" : "Teachers",
      value: stats.teachers,
      changeType: "positive" as const,
      icon: <Users className="h-5 w-5" />,
      href: `${adminBase}/${Routes.TEACHERS}`,
    },
    {
      title: isAr ? "الفعاليات" : "Events",
      value: stats.events,
      changeType: "neutral" as const,
      icon: <Calendar className="h-5 w-5" />,
      href: `${adminBase}/events`,
    },
    {
      title: isAr ? "الرسائل" : "Messages",
      value: stats.messages,
      changeType: "negative" as const,
      icon: <Mail className="h-5 w-5" />,
      href: `${adminBase}/messages`,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={isAr ? "لوحة التحكم" : "Dashboard"}
        description={
          isAr ? "نظرة عامة على نشاط المدرسة — اضغط على البطاقات للانتقال" : "Overview — click cards to navigate"
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.href} {...card} />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">
          {isAr ? "إجراءات سريعة" : "Quick actions"}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: isAr ? "مقال جديد" : "New article", href: `${adminBase}/articles/new` },
            {
              label: isAr ? "إعلان جديد" : "New announcement",
              href: `${adminBase}/${Routes.ANNOUNCEMENTS}/new`,
            },
            { label: isAr ? "إضافة معلم" : "Add teacher", href: `${adminBase}/${Routes.TEACHERS}/new` },
            { label: isAr ? "الرسائل" : "View messages", href: `${adminBase}/messages` },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-sm"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
