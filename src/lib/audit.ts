import { db } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma";

export async function createAuditLog(params: {
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, unknown>;
  userId?: string;
  ip?: string;
}) {
  try {
    const data: Prisma.AuditLogUncheckedCreateInput = {
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      userId: params.userId,
      ip: params.ip,
      details: params.details as Prisma.InputJsonValue | undefined,
    };
    await db.auditLog.create({ data });
  } catch {
    // Non-blocking audit logging
  }
}

export async function trackVisitor(params: {
  path: string;
  locale?: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
}) {
  try {
    await db.visitorStat.create({ data: params });
  } catch {
    // Non-blocking visitor tracking
  }
}
