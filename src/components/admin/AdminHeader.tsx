"use client";

import Link from "next/link";
import { Routes } from "@/constants/enums";

type AdminHeaderProps = {
  locale: string;
  title?: string;
  onMenuClick: () => void;
  userName?: string;
};

export default function AdminHeader({
  locale,
  title,
  onMenuClick,
  userName = "Admin",
}: AdminHeaderProps) {
  const isAr = locale === "ar";
  const displayTitle = title ?? (isAr ? "لوحة التحكم" : "Dashboard");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label={isAr ? "فتح القائمة" : "Open menu"}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-slate-900">{displayTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={`/${locale}/${Routes.ADMIN}/messages`}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label={isAr ? "الرسائل" : "Messages"}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </Link>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
