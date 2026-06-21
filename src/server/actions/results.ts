"use server";

import { db } from "@/lib/prisma";
import { ResultFileType } from "@/generated/prisma";
import { storeUploadedFile, detectResultFileType, isAllowedResultFile } from "@/lib/storage";
import { createAuditLog } from "@/lib/audit";
import { addLocalResult } from "@/lib/local-results";
import { type FormActionState, t } from "@/lib/action-state";
import { resolveBilingualField } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const file = formData.get("resultFile") as File | null;
  const parsed = parseResultForm(formData);

  if (!parsed.title) {
    return { ok: false, fieldErrors: { title: t(locale, "عنوان النتيجة مطلوب", "Result title is required") } };
  }

  if (!file || file.size === 0) {
    return { ok: false, fieldErrors: { resultFile: t(locale, "يرجى اختيار ملف", "Please select a file") } };
  }

  if (!isAllowedResultFile(file.type)) {
    return {
      ok: false,
      error: t(locale, "الملفات المدعومة: PDF, JPG, PNG, JPEG", "Supported files: PDF, JPG, PNG, JPEG"),
    };
  }

  try {
    const fileUrl = await storeUploadedFile(file, "results");
    const fileType =
      detectResultFileType(file.type) === "PDF" ? ResultFileType.PDF : ResultFileType.IMAGE;

    try {
      const result = await db.schoolResult.create({
        data: { ...parsed, fileUrl, fileType },
      });
      await createAuditLog({
        action: "CREATE",
        entity: "SchoolResult",
        entityId: result.id,
        details: { title: result.title },
      });
    } catch {
      await addLocalResult({ ...parsed, fileUrl, fileType: fileType === ResultFileType.PDF ? "PDF" : "IMAGE" });
    }

    revalidatePath(`/${locale}/admin/results`);
    revalidatePath(`/${locale}/results`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("createSchoolResult:", error);
    return { ok: false, error: t(locale, "تعذر رفع النتيجة", "Could not upload result") };
  }
}

export async function updateSchoolResult(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");
  const file = formData.get("resultFile") as File | null;
  const parsed = parseResultForm(formData);

  if (!parsed.title) {
    return { ok: false, fieldErrors: { title: t(locale, "عنوان النتيجة مطلوب", "Result title is required") } };
  }

  try {
    const existing = await db.schoolResult.findUnique({ where: { id } });
    if (!existing) {
      return { ok: false, error: t(locale, "النتيجة غير موجودة", "Result not found") };
    }

    let fileUrl = existing.fileUrl;
    let fileType = existing.fileType;

    if (file && file.size > 0) {
      if (!isAllowedResultFile(file.type)) {
        return {
          ok: false,
          error: t(locale, "الملفات المدعومة: PDF, JPG, PNG, JPEG", "Supported files: PDF, JPG, PNG, JPEG"),
        };
      }
      fileUrl = await storeUploadedFile(file, "results");
      fileType = detectResultFileType(file.type) === "PDF" ? ResultFileType.PDF : ResultFileType.IMAGE;
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
    return { ok: false, error: t(locale, "تعذر تحديث النتيجة", "Could not update result") };
  }
}

export async function deleteSchoolResult(id: string, locale: string) {
  try {
    await db.schoolResult.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "SchoolResult", entityId: id });
  } catch {
    // ignore
  }
  revalidatePath(`/${locale}/admin/results`);
  revalidatePath(`/${locale}/results`);
  revalidatePath(`/${locale}`);
  redirect(`/${locale}/admin/results`);
}
