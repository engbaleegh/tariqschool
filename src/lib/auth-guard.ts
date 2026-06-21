import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { UserRole } from "@/generated/prisma";
import { hasPermission, Permission, isAdminRole } from "@/lib/permissions";
import { redirect } from "next/navigation";

export async function requireAuth(locale: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }
  return session;
}

export async function requireAdmin(locale: string) {
  const session = await requireAuth(locale);
  if (!isAdminRole(session.user.role)) {
    redirect(`/${locale}`);
  }
  return session;
}

export async function requirePermission(locale: string, permission: Permission) {
  const session = await requireAdmin(locale);
  if (!hasPermission(session.user.role as UserRole, permission)) {
    redirect(`/${locale}/admin`);
  }
  return session;
}
