"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { storeFileDetailed, isAllowedImage, StorageError, resolveMimeType, deleteBlobUrl } from "@/lib/storage";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { resolveBilingualField } from "@/lib/utils";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

const TEACHER_FORM_KEYS = [
  "fullName",
  "fullNameAr",
  "email",
  "phone",
  "jobTitle",
  "jobTitleAr",
  "department",
  "departmentAr",
  "biography",
  "biographyAr",
  "qualifications",
  "qualificationsAr",
];

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
    if (existingPhoto) await deleteBlobUrl(existingPhoto);
    photo = null;
  } else if (photoFile && photoFile.size > 0) {
    const mime = resolveMimeType(photoFile);
    if (!isAllowedImage(mime)) throw new StorageError("invalid-image");
    if (existingPhoto) await deleteBlobUrl(existingPhoto);
    const stored = await storeFileDetailed(photoFile, "teachers");
    photo = stored.url;
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
    await assertAdminSession();
  } catch {
    return withFormValues(
      { ok: false, error: t(locale, "غير مصرح", "Unauthorized") },
      formData,
      TEACHER_FORM_KEYS
    );
  }

  try {
    const data = await parseTeacherForm(formData);

    if (!data.fullName) {
      return withFormValues(
        {
          ok: false,
          fieldErrors: { fullName: t(locale, "اسم المعلم مطلوب", "Teacher name is required") },
        },
        formData,
        TEACHER_FORM_KEYS
      );
    }

    const teacher = await db.teacher.create({ data });
    await createAuditLog({
      action: "CREATE",
      entity: "Teacher",
      entityId: teacher.id,
      details: { fullName: teacher.fullName },
    });

    revalidatePath(`/${locale}/admin/teachers`);
    revalidatePath(`/${locale}/teachers`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues(
        {
          ok: false,
          error:
            error.message === "invalid-image"
              ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
              : error.message,
        },
        formData,
        TEACHER_FORM_KEYS
      );
    }
    console.error("createTeacher:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر حفظ المعلم", "Could not save teacher") },
      formData,
      TEACHER_FORM_KEYS
    );
  }
}

export async function updateTeacher(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues(
      { ok: false, error: t(locale, "غير مصرح", "Unauthorized") },
      formData,
      TEACHER_FORM_KEYS
    );
  }

  if (id.startsWith("local-")) {
    return withFormValues(
      {
        ok: false,
        error: t(
          locale,
          "هذا المعلم محفوظ محلياً ولا يمكن تعديله. أضف معلماً جديداً من قاعدة البيانات.",
          "This teacher was stored locally and cannot be edited. Please add a new teacher."
        ),
      },
      formData,
      TEACHER_FORM_KEYS
    );
  }

  try {
    const data = await parseTeacherForm(formData);

    if (!data.fullName) {
      return withFormValues(
        {
          ok: false,
          fieldErrors: { fullName: t(locale, "اسم المعلم مطلوب", "Teacher name is required") },
        },
        formData,
        TEACHER_FORM_KEYS
      );
    }

    const teacher = await db.teacher.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Teacher",
      entityId: id,
      details: { fullName: teacher.fullName },
    });

    revalidatePath(`/${locale}/admin/teachers`);
    revalidatePath(`/${locale}/teachers`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues(
        {
          ok: false,
          error:
            error.message === "invalid-image"
              ? t(locale, "صيغة الصورة غير مدعومة", "Unsupported image format")
              : error.message,
        },
        formData,
        TEACHER_FORM_KEYS
      );
    }
    console.error("updateTeacher:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر تحديث المعلم", "Could not update teacher") },
      formData,
      TEACHER_FORM_KEYS
    );
  }
}

export type DeleteTeacherResult = { ok: true } | { ok: false; error: string };

export async function deleteTeacherAction(id: string, locale: string): Promise<DeleteTeacherResult> {
  const isAr = locale === "ar";

  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  if (id.startsWith("local-")) {
    return {
      ok: false,
      error: isAr
        ? "لا يمكن حذف معلم محفوظ محلياً على الخادم. أعد تحميل الصفحة."
        : "Cannot delete a locally stored teacher on the server. Refresh the page.",
    };
  }

  try {
    const teacher = await db.teacher.findUnique({ where: { id } });
    if (!teacher) {
      return { ok: false, error: isAr ? "المعلم غير موجود" : "Teacher not found" };
    }

    if (teacher.photo) {
      await deleteBlobUrl(teacher.photo);
    }

    await db.teacher.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Teacher", entityId: id });

    revalidatePath(`/${locale}/admin/teachers`);
    revalidatePath(`/${locale}/teachers`);
    return { ok: true };
  } catch (error) {
    console.error("deleteTeacherAction:", error);
    return { ok: false, error: isAr ? "تعذر حذف المعلم" : "Could not delete teacher" };
  }
}
