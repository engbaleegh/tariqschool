"use server";

import bcrypt from "bcrypt";
import { db } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";
import { createAuditLog } from "@/lib/audit";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

const USER_FORM_KEYS = ["name", "email", "role"];

function parseUserForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    role: (String(formData.get("role") ?? "EDITOR") as UserRole) || UserRole.EDITOR,
    isActive: formData.get("isActive") === "on",
    password: String(formData.get("password") ?? ""),
  };
}

export async function createUser(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, USER_FORM_KEYS);
  }

  try {
    const parsed = parseUserForm(formData);
    if (!parsed.name) {
      return withFormValues(
        { ok: false, fieldErrors: { name: t(locale, "الاسم مطلوب", "Name is required") } },
        formData,
        USER_FORM_KEYS
      );
    }
    if (!parsed.email) {
      return withFormValues(
        { ok: false, fieldErrors: { email: t(locale, "البريد مطلوب", "Email is required") } },
        formData,
        USER_FORM_KEYS
      );
    }
    if (!parsed.password || parsed.password.length < 6) {
      return withFormValues(
        { ok: false, fieldErrors: { password: t(locale, "كلمة المرور مطلوبة (6 أحرف على الأقل)", "Password required (min 6 chars)") } },
        formData,
        [...USER_FORM_KEYS, "password"]
      );
    }

    const existing = await db.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return withFormValues(
        { ok: false, error: t(locale, "البريد مستخدم مسبقاً", "Email already in use") },
        formData,
        USER_FORM_KEYS
      );
    }

    const hashed = await bcrypt.hash(parsed.password, 10);
    const user = await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
        role: parsed.role,
        isActive: parsed.isActive,
      },
    });

    await createAuditLog({ action: "CREATE", entity: "User", entityId: user.id, details: { email: user.email } });
    revalidatePath(`/${locale}/admin/users`);
    return { ok: true };
  } catch (error) {
    console.error("createUser:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر إنشاء المستخدم", "Could not create user") }, formData, USER_FORM_KEYS);
  }
}

export async function updateUser(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, USER_FORM_KEYS);
  }

  try {
    const parsed = parseUserForm(formData);
    if (!parsed.name) {
      return withFormValues(
        { ok: false, fieldErrors: { name: t(locale, "الاسم مطلوب", "Name is required") } },
        formData,
        USER_FORM_KEYS
      );
    }
    if (!parsed.email) {
      return withFormValues(
        { ok: false, fieldErrors: { email: t(locale, "البريد مطلوب", "Email is required") } },
        formData,
        USER_FORM_KEYS
      );
    }

    const data: {
      name: string;
      email: string;
      role: UserRole;
      isActive: boolean;
      password?: string;
    } = {
      name: parsed.name,
      email: parsed.email,
      role: parsed.role,
      isActive: parsed.isActive,
    };

    if (parsed.password) {
      if (parsed.password.length < 6) {
        return withFormValues(
          { ok: false, fieldErrors: { password: t(locale, "كلمة المرور قصيرة جداً", "Password too short") } },
          formData,
          [...USER_FORM_KEYS, "password"]
        );
      }
      data.password = await bcrypt.hash(parsed.password, 10);
    }

    const user = await db.user.update({ where: { id }, data });
    await createAuditLog({ action: "UPDATE", entity: "User", entityId: id, details: { email: user.email } });
    revalidatePath(`/${locale}/admin/users`);
    return { ok: true };
  } catch (error) {
    console.error("updateUser:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر تحديث المستخدم", "Could not update user") }, formData, USER_FORM_KEYS);
  }
}

export type DeleteUserResult = { ok: true } | { ok: false; error: string };

export async function deleteUserAction(id: string, locale: string): Promise<DeleteUserResult> {
  const isAr = locale === "ar";
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  try {
    await db.user.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "User", entityId: id });
    revalidatePath(`/${locale}/admin/users`);
    return { ok: true };
  } catch (error) {
    console.error("deleteUserAction:", error);
    return { ok: false, error: isAr ? "تعذر حذف المستخدم" : "Could not delete user" };
  }
}
