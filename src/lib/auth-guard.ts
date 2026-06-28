import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { UserRole } from "@/generated/prisma";
import { hasPermission, Permission, isAdminRole } from "@/lib/permissions";
import { db } from "@/lib/prisma";
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

  if (session.user.id === "bootstrap-admin") {
    try {
      const userCount = await db.user.count();
      if (userCount > 0) {
        redirect(`/${locale}/auth/signin`);
      }
    } catch {
      // Database unavailable — allow bootstrap session
    }
    return session;
  }

  try {
    const dbUser = await db.user.findUnique({ where: { id: session.user.id } });
    if (!dbUser?.isActive) {
      redirect(`/${locale}/auth/signin`);
    }
  } catch {
    // Database unavailable — allow existing session
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
