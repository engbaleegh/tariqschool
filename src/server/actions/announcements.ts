"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import { slugify, slugifyAscii, resolveBilingualField } from "@/lib/utils";
import { type FormActionState, t } from "@/lib/action-state";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

function parseAnnouncementForm(formData: FormData) {
  const title = resolveBilingualField(
    String(formData.get("title") ?? ""),
    String(formData.get("titleAr") ?? "")
  );
  const content = resolveBilingualField(
    String(formData.get("content") ?? ""),
    String(formData.get("contentAr") ?? "")
  );
  const slugInput = String(formData.get("slug") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();

  return {
    title,
    titleAr: String(formData.get("titleAr") ?? "").trim() || title,
    slug: slugInput || slugifyAscii(title) || slugifyAscii(String(formData.get("titleAr") ?? "")) || slugify(title),
    content,
    contentAr: String(formData.get("contentAr") ?? "").trim() || content,
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    excerptAr: String(formData.get("excerptAr") ?? "").trim() || null,
    isPublished,
    publishedAt: isPublished
      ? publishedAtRaw
        ? new Date(publishedAtRaw)
        : new Date()
      : null,
    categoryId: String(formData.get("categoryId") ?? "").trim() || null,
  };
}

export async function createAnnouncement(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    const data = parseAnnouncementForm(formData);

    if (!data.title) {
      return { ok: false, fieldErrors: { title: t(locale, "العنوان مطلوب", "Title is required") } };
    }
    if (!data.content) {
      return { ok: false, fieldErrors: { content: t(locale, "المحتوى مطلوب", "Content is required") } };
    }

    const announcement = await db.announcement.create({ data });
    await createAuditLog({
      action: "CREATE",
      entity: "Announcement",
      entityId: announcement.id,
      details: { title: announcement.title },
    });

    revalidatePath(`/${locale}/admin/announcements`);
    revalidatePath(`/${locale}/announcements`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("createAnnouncement:", error);
    return { ok: false, error: t(locale, "تعذر حفظ الإعلان", "Could not save announcement") };
  }
}

export async function updateAnnouncement(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    const data = parseAnnouncementForm(formData);

    if (!data.title) {
      return { ok: false, fieldErrors: { title: t(locale, "العنوان مطلوب", "Title is required") } };
    }
    if (!data.content) {
      return { ok: false, fieldErrors: { content: t(locale, "المحتوى مطلوب", "Content is required") } };
    }

    const announcement = await db.announcement.update({ where: { id }, data });
    await createAuditLog({
      action: "UPDATE",
      entity: "Announcement",
      entityId: id,
      details: { title: announcement.title },
    });

    revalidatePath(`/${locale}/admin/announcements`);
    revalidatePath(`/${locale}/announcements`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("updateAnnouncement:", error);
    return { ok: false, error: t(locale, "تعذر تحديث الإعلان", "Could not update announcement") };
  }
}

export async function deleteAnnouncement(id: string, locale: string) {
  await db.announcement.delete({ where: { id } });
  await createAuditLog({ action: "DELETE", entity: "Announcement", entityId: id });
  revalidatePath(`/${locale}/admin/announcements`);
  revalidatePath(`/${locale}/announcements`);
  revalidatePath(`/${locale}`);
}

export type DeleteAnnouncementResult = { ok: true } | { ok: false; error: string };

export async function deleteAnnouncementAction(id: string, locale: string): Promise<DeleteAnnouncementResult> {
  const isAr = locale === "ar";
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  try {
    await deleteAnnouncement(id, locale);
    return { ok: true };
  } catch (error) {
    console.error("deleteAnnouncementAction:", error);
    return { ok: false, error: isAr ? "تعذر حذف الإعلان" : "Could not delete announcement" };
  }
}
