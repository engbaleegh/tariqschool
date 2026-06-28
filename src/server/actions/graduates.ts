"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { storeFileDetailed, isAllowedImage, StorageError, resolveMimeType } from "@/lib/storage";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { resolveBilingualField } from "@/lib/utils";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const GRADUATE_FORM_KEYS = ["name", "nameAr", "biography", "biographyAr"];
const MAX_HOMEPAGE_GRADUATES = 3;

async function assertHomepageGraduateLimit(featuredOnHomepage: boolean, excludeId?: string) {
  if (!featuredOnHomepage) return;

  const count = await db.graduate.count({
    where: {
      featuredOnHomepage: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  if (count >= MAX_HOMEPAGE_GRADUATES) {
    throw new Error("homepage-limit");
  }
}

async function parseGraduateForm(formData: FormData) {
  const name = resolveBilingualField(
    String(formData.get("name") ?? ""),
    String(formData.get("nameAr") ?? "")
  );

  const photoFile = formData.get("photo") as File | null;
  const existingPhoto = String(formData.get("existingPhoto") ?? "").trim() || null;
  let photo = existingPhoto;

  if (formData.get("removePhoto") === "on") {
    photo = null;
  } else if (photoFile && photoFile.size > 0) {
    const mime = resolveMimeType(photoFile);
    if (!isAllowedImage(mime)) throw new StorageError("invalid-image");
    const stored = await storeFileDetailed(photoFile, "graduates");
    photo = stored.url;
  }

  return {
    name,
    nameAr: String(formData.get("nameAr") ?? "").trim() || name,
    biography: String(formData.get("biography") ?? "").trim() || null,
    biographyAr: String(formData.get("biographyAr") ?? "").trim() || null,
    photo,
    order: Number(formData.get("order") ?? 0) || 0,
    isActive: formData.get("isActive") === "on",
    featuredOnHomepage: formData.get("featuredOnHomepage") === "on",
  };
}

export async function createGraduate(
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
      GRADUATE_FORM_KEYS
    );
  }

  try {
    const data = await parseGraduateForm(formData);

    if (!data.name) {
      return withFormValues(
        {
          ok: false,
          fieldErrors: { name: t(locale, "اسم الخريج مطلوب", "Graduate name is required") },
        },
        formData,
        GRADUATE_FORM_KEYS
      );
    }

    await assertHomepageGraduateLimit(data.featuredOnHomepage);

    const graduate = await db.graduate.create({ data });
    await createAuditLog({
      action: "CREATE",
      entity: "Graduate",
      entityId: graduate.id,
      details: { name: graduate.name },
    });

    revalidatePath(`/${locale}/admin/graduates`);
    revalidatePath(`/${locale}/graduates`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "homepage-limit") {
      return withFormValues(
        {
          ok: false,
          error: t(
            locale,
            "يمكن عرض 3 خريجين فقط في الصفحة الرئيسية",
            "Only 3 graduates can appear on the homepage"
          ),
        },
        formData,
        GRADUATE_FORM_KEYS
      );
    }
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
        GRADUATE_FORM_KEYS
      );
    }
    console.error("createGraduate:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر حفظ الخريج", "Could not save graduate") },
      formData,
      GRADUATE_FORM_KEYS
    );
  }
}

export async function updateGraduate(
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
      GRADUATE_FORM_KEYS
    );
  }

  try {
    const data = await parseGraduateForm(formData);

    if (!data.name) {
      return withFormValues(
        {
          ok: false,
          fieldErrors: { name: t(locale, "اسم الخريج مطلوب", "Graduate name is required") },
        },
        formData,
        GRADUATE_FORM_KEYS
      );
    }

    await assertHomepageGraduateLimit(data.featuredOnHomepage, id);

    const graduate = await db.graduate.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Graduate",
      entityId: id,
      details: { name: graduate.name },
    });

    revalidatePath(`/${locale}/admin/graduates`);
    revalidatePath(`/${locale}/graduates`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof Error && error.message === "homepage-limit") {
      return withFormValues(
        {
          ok: false,
          error: t(
            locale,
            "يمكن عرض 3 خريجين فقط في الصفحة الرئيسية",
            "Only 3 graduates can appear on the homepage"
          ),
        },
        formData,
        GRADUATE_FORM_KEYS
      );
    }
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
        GRADUATE_FORM_KEYS
      );
    }
    console.error("updateGraduate:", error);
    return withFormValues(
      { ok: false, error: t(locale, "تعذر تحديث الخريج", "Could not update graduate") },
      formData,
      GRADUATE_FORM_KEYS
    );
  }
}

export async function deleteGraduate(id: string, locale: string) {
  await assertAdminSession();
  await db.graduate.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Graduate", entityId: id });
  revalidatePath(`/${locale}/admin/graduates`);
  revalidatePath(`/${locale}/graduates`);
  revalidatePath(`/${locale}`);
  redirect(`/${locale}/admin/graduates`);
}

export async function toggleGraduateActive(id: string, locale: string, isActive: boolean) {
  await assertAdminSession();
  await db.graduate.update({ where: { id }, data: { isActive } });
  revalidatePath(`/${locale}/admin/graduates`);
  revalidatePath(`/${locale}/graduates`);
  revalidatePath(`/${locale}`);
}

export async function toggleGraduateHomepage(id: string, locale: string, featuredOnHomepage: boolean) {
  await assertAdminSession();

  try {
    if (featuredOnHomepage) {
      await assertHomepageGraduateLimit(true, id);
    }
    await db.graduate.update({ where: { id }, data: { featuredOnHomepage } });
    revalidatePath(`/${locale}/admin/graduates`);
    revalidatePath(`/${locale}/graduates`);
    revalidatePath(`/${locale}`);
  } catch (error) {
    if (error instanceof Error && error.message === "homepage-limit") {
      redirect(`/${locale}/admin/graduates?error=homepage-limit`);
    }
    throw error;
  }
}
