"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { isAdminRole } from "@/lib/permissions";
import { UserRole } from "@/generated/prisma";

export async function assertAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isAdminRole(session.user.role as UserRole)) {
    throw new Error("unauthorized");
  }
  return session;
}
