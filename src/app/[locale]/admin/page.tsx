import Link from "next/link";
import { FileText, Users, Calendar, Mail } from "lucide-react";
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

  return (
    <div className="space-y-8">
      <PageHeader
        title={isAr ? "لوحة التحكم" : "Dashboard"}
        description={
          isAr ? "نظرة عامة على نشاط المدرسة" : "Overview of your school CMS activity and content."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={isAr ? "المقالات" : "Total Articles"}
          value={stats.articles}
          changeType="neutral"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title={isAr ? "المعلمون" : "Active Teachers"}
          value={stats.teachers}
          changeType="positive"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title={isAr ? "الفعاليات" : "Upcoming Events"}
          value={stats.events}
          changeType="neutral"
          icon={<Calendar className="h-5 w-5" />}
        />
        <StatCard
          title={isAr ? "الرسائل" : "Unread Messages"}
          value={stats.messages}
          changeType="negative"
          icon={<Mail className="h-5 w-5" />}
        />
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
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
