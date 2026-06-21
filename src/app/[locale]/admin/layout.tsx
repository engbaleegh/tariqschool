import { requireAdmin } from "@/lib/auth-guard";
import AdminShell from "@/components/admin/AdminShell";
import type { Locale } from "@/i18n.config";

type AdminLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = await params;
  const session = await requireAdmin(locale);

  return (
    <AdminShell locale={locale} userName={session.user.name ?? undefined}>
      {children}
    </AdminShell>
  );
}
