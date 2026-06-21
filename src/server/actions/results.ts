"use server";

import { db } from "@/lib/prisma";
import { ResultFileType } from "@/generated/prisma";
import {
  storeFileDetailed,
  detectResultFileType,
  isAllowedResultFile,
  StorageError,
  resolveMimeType,
} from "@/lib/storage";
import { createAuditLog } from "@/lib/audit";
import { assertAdminSession } from "@/lib/action-auth";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues, extractFormValues } from "@/lib/form-values";
import { resolveBilingualField } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const RESULT_FORM_KEYS = [
  "title",
  "titleAr",
  "description",
  "descriptionAr",
  "academicYear",
  "semester",
  "category",
];

function parseResultForm(formData: FormData) {
  const title = resolveBilingualField(
    String(formData.get("title") ?? ""),
    String(formData.get("titleAr") ?? "")
  );

  return {
    title,
    titleAr: String(formData.get("titleAr") ?? "").trim() || title,
    description: String(formData.get("description") ?? "").trim() || null,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || null,
    academicYear: String(formData.get("academicYear") ?? "").trim() || null,
    semester: String(formData.get("semester") ?? "").trim() || null,
    category: String(formData.get("category") ?? "").trim() || null,
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createSchoolResult(
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
      RESULT_FORM_KEYS
    );
  }

  const file = formData.get("resultFile") as File | null;
  const parsed = parseResultForm(formData);

  if (!parsed.title) {
    return withFormValues(
      {
        ok: false,
        fieldErrors: { title: t(locale, "عنوان النتيجة مطلوب", "Result title is required") },
      },
      formData,
      RESULT_FORM_KEYS
    );
  }

  if (!file || file.size === 0) {
    return withFormValues(
      {
        ok: false,
        fieldErrors: { resultFile: t(locale, "يرجى اختيار ملف", "Please select a file") },
      },
      formData,
      RESULT_FORM_KEYS
    );
  }

  const mime = resolveMimeType(file);
  if (!isAllowedResultFile(mime)) {
    return withFormValues(
      {
        ok: false,
        error: t(locale, "الملفات المدعومة: PDF, JPG, PNG, JPEG, WEBP", "Supported: PDF, JPG, PNG, JPEG, WEBP"),
      },
      formData,
      RESULT_FORM_KEYS
    );
  }

  try {
    const stored = await storeFileDetailed(file, "results");
    const fileType =
      detectResultFileType(stored.mimeType) === "PDF" ? ResultFileType.PDF : ResultFileType.IMAGE;

    const result = await db.schoolResult.create({
      data: { ...parsed, fileUrl: stored.url, fileType },
    });

    await createAuditLog({
      action: "CREATE",
      entity: "SchoolResult",
      entityId: result.id,
      details: { title: result.title },
    });

    revalidatePath(`/${locale}/admin/results`);
    revalidatePath(`/${locale}/results`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("createSchoolResult:", error);
    const message =
      error instanceof StorageError
        ? error.message
        : t(locale, "تعذر رفع النتيجة. تحقق من الاتصال بقاعدة البيانات.", "Could not upload result. Check database connection.");
    return withFormValues({ ok: false, error: message }, formData, RESULT_FORM_KEYS);
  }
}

export async function updateSchoolResult(
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
      RESULT_FORM_KEYS
    );
  }

  const file = formData.get("resultFile") as File | null;
  const parsed = parseResultForm(formData);

  if (!parsed.title) {
    return withFormValues(
      {
        ok: false,
        fieldErrors: { title: t(locale, "عنوان النتيجة مطلوب", "Result title is required") },
      },
      formData,
      RESULT_FORM_KEYS
    );
  }

  try {
    const existing = await db.schoolResult.findUnique({ where: { id } });
    if (!existing) {
      return withFormValues(
        { ok: false, error: t(locale, "النتيجة غير موجودة", "Result not found") },
        formData,
        RESULT_FORM_KEYS
      );
    }

    let fileUrl = existing.fileUrl;
    let fileType = existing.fileType;

    if (file && file.size > 0) {
      const mime = resolveMimeType(file);
      if (!isAllowedResultFile(mime)) {
        return withFormValues(
          {
            ok: false,
            error: t(locale, "الملفات المدعومة: PDF, JPG, PNG, JPEG, WEBP", "Supported: PDF, JPG, PNG, JPEG, WEBP"),
          },
          formData,
          RESULT_FORM_KEYS
        );
      }
      const stored = await storeFileDetailed(file, "results");
      fileUrl = stored.url;
      fileType = detectResultFileType(stored.mimeType) === "PDF" ? ResultFileType.PDF : ResultFileType.IMAGE;
    }

    await db.schoolResult.update({
      where: { id },
      data: { ...parsed, fileUrl, fileType },
    });

    await createAuditLog({ action: "UPDATE", entity: "SchoolResult", entityId: id, details: { title: parsed.title } });

    revalidatePath(`/${locale}/admin/results`);
    revalidatePath(`/${locale}/results`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("updateSchoolResult:", error);
    const message =
      error instanceof StorageError
        ? error.message
        : t(locale, "تعذر تحديث النتيجة", "Could not update result");
    return withFormValues({ ok: false, error: message }, formData, RESULT_FORM_KEYS);
  }
}

export async function deleteSchoolResult(id: string, locale: string) {
  await assertAdminSession();
  await db.schoolResult.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "SchoolResult", entityId: id });
  revalidatePath(`/${locale}/admin/results`);
  revalidatePath(`/${locale}/results`);
  revalidatePath(`/${locale}`);
  redirect(`/${locale}/admin/results`);
}

export async function getSchoolResultForEdit(id: string) {
  return db.schoolResult.findUnique({ where: { id } });
}

export { extractFormValues as extractResultFormValues };
