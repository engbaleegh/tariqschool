"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}) {
  const hashed = await bcrypt.hash(data.password, 12);
  const user = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      phone: data.phone,
    },
  });
  await createAuditLog({
    action: "CREATE",
    entity: "User",
    entityId: user.id,
    details: { email: user.email, role: user.role },
  });
  revalidatePath("/admin/users");
  return user;
}

export async function updateUser(
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone: string;
    isActive: boolean;
  }>
) {
  const updateData: Record<string, unknown> = { ...data };
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12);
  }
  const user = await db.user.update({ where: { id }, data: updateData });
  await createAuditLog({ action: "UPDATE", entity: "User", entityId: id });
  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(id: string) {
  await db.user.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "User", entityId: id });
  revalidatePath("/admin/users");
}
