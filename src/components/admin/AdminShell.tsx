"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminIdleTimeout } from "@/components/admin/AdminIdleTimeout";

type AdminShellProps = {
  locale: string;
  userName?: string;
  children: React.ReactNode;
};

export default function AdminShell({ locale, userName, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <AdminIdleTimeout locale={locale} />
      <AdminSidebar
        locale={locale}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={isAr ? "lg:pr-64" : "lg:pl-64"}>
        <AdminHeader
          locale={locale}
          userName={userName}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
