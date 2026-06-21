"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import {
  addLocalTeacher,
  updateLocalTeacher,
  deleteLocalTeacher,
  getLocalTeacherById,
  isLocalTeacherId,
} from "@/lib/local-teachers";
import { storeUploadedFile, isAllowedImage } from "@/lib/storage";
import { type FormActionState, t } from "@/lib/action-state";
import { resolveBilingualField } from "@/lib/utils";
import { revalidatePath } from "next/cache";

async function parseTeacherForm(formData: FormData) {
  const fullName = resolveBilingualField(
    String(formData.get("fullName") ?? ""),
    String(formData.get("fullNameAr") ?? "")
  );
  const fullNameAr = String(formData.get("fullNameAr") ?? "").trim() || null;

  const photoFile = formData.get("photo") as File | null;
  const existingPhoto = String(formData.get("existingPhoto") ?? "").trim() || null;
  let photo = existingPhoto;

  if (formData.get("removePhoto") === "on") {
    photo = null;
  } else if (photoFile && photoFile.size > 0) {
    if (!isAllowedImage(photoFile.type)) {
      throw new Error("invalid-image");
    }
    photo = await storeUploadedFile(photoFile, "teachers");
  }

  return {
    fullName,
    fullNameAr: fullNameAr ?? fullName,
    photo,
    jobTitle: String(formData.get("jobTitle") ?? "").trim() || null,
    jobTitleAr: String(formData.get("jobTitleAr") ?? "").trim() || null,
    department: String(formData.get("department") ?? "").trim() || null,
    departmentAr: String(formData.get("departmentAr") ?? "").trim() || null,
    biography: String(formData.get("biography") ?? "").trim() || null,
    biographyAr: String(formData.get("biographyAr") ?? "").trim() || null,
    qualifications: String(formData.get("qualifications") ?? "").trim() || null,
    qualificationsAr: String(formData.get("qualificationsAr") ?? "").trim() || null,
    email: String(formData.get("email") ?? "").trim() || null,
    phone: String(formData.get("phone") ?? "").trim() || null,
    order: Number(formData.get("order") ?? 0) || 0,
    isActive: formData.get("isActive") === "on",
  };
}

export async function createTeacher(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    const data = await parseTeacherForm(formData);

    if (!data.fullName) {
      return {
        ok: false,
        fieldErrors: {
          fullName: t(locale, "اسم المعلم مطلوب", "Teacher name is required"),
        },
      };
    }

    try {
      const teacher = await db.teacher.create({ data });
      await createAuditLog({
        action: "CREATE",
        entity: "Teacher",
        entityId: teacher.id,
        details: { fullName: teacher.fullName },
      });
    } catch {
      await addLocalTeacher(data);
    }

    revalidatePath(`/${locale}/admin/teachers`);
    revalidatePath(`/${locale}/teachers`);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "invalid-image") {
      return {
        ok: false,
        error: t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format"),
      };
    }
    return {
      ok: false,
      error: t(locale, "تعذر حفظ المعلم", "Could not save teacher"),
    };
  }
}

export async function updateTeacher(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    const data = await parseTeacherForm(formData);

    if (!data.fullName) {
      return {
        ok: false,
        fieldErrors: {
          fullName: t(locale, "اسم المعلم مطلوب", "Teacher name is required"),
        },
      };
    }

    if (isLocalTeacherId(id)) {
      await updateLocalTeacher(id, data);
    } else {
      try {
        const teacher = await db.teacher.update({ where: { id }, data });
        await createAuditLog({
          action: "UPDATE",
          entity: "Teacher",
          entityId: id,
          details: { fullName: teacher.fullName },
        });
      } catch {
        if (await getLocalTeacherById(id)) {
          await updateLocalTeacher(id, data);
        } else {
          await addLocalTeacher(data);
        }
      }
    }

    revalidatePath(`/${locale}/admin/teachers`);
    revalidatePath(`/${locale}/teachers`);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "invalid-image") {
      return {
        ok: false,
        error: t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format"),
      };
    }
    return {
      ok: false,
      error: t(locale, "تعذر تحديث المعلم", "Could not update teacher"),
    };
  }
}

export async function deleteTeacher(id: string, locale: string) {
  if (isLocalTeacherId(id)) {
    await deleteLocalTeacher(id);
  } else {
    try {
      await db.teacher.delete({ where: { id } });
      await createAuditLog({ action: "DELETE", entity: "Teacher", entityId: id });
    } catch {
      await deleteLocalTeacher(id);
    }
  }

  revalidatePath(`/${locale}/admin/teachers`);
  revalidatePath(`/${locale}/teachers`);
}
