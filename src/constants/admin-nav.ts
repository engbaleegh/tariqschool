import { Routes } from "@/constants/enums";

export type AdminNavItem = {
  labelAr: string;
  labelEn: string;
  segment: string;
};

export const adminNavItems: AdminNavItem[] = [
  { labelAr: "لوحة التحكم", labelEn: "Dashboard", segment: "" },
  { labelAr: "الصفحة الرئيسية", labelEn: "Homepage", segment: "homepage" },
  { labelAr: "المعلمون", labelEn: "Teachers", segment: Routes.TEACHERS },
  { labelAr: "الإعلانات", labelEn: "Announcements", segment: Routes.ANNOUNCEMENTS },
  { labelAr: "المقالات", labelEn: "Articles", segment: "articles" },
  { labelAr: "الفعاليات", labelEn: "Events", segment: "events" },
  { labelAr: "المعرض", labelEn: "Gallery", segment: Routes.GALLERY },
  { labelAr: "النتائج", labelEn: "Results", segment: Routes.RESULTS },
  { labelAr: "التحميلات", labelEn: "Downloads", segment: Routes.DOWNLOADS },
  { labelAr: "التقويم", labelEn: "Calendar", segment: Routes.CALENDAR },
  { labelAr: "الوسائط", labelEn: "Media", segment: "media" },
  { labelAr: "المستخدمون", labelEn: "Users", segment: "users" },
  { labelAr: "الرسائل", labelEn: "Messages", segment: "messages" },
  { labelAr: "سجل التدقيق", labelEn: "Audit Logs", segment: "audit-logs" },
  { labelAr: "الإعدادات", labelEn: "Settings", segment: "settings" },
];

export function getAdminNavLabel(item: AdminNavItem, locale: string) {
  return locale === "ar" ? item.labelAr : item.labelEn;
}
