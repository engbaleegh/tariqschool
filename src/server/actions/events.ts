"use server";

import { db } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import {
  storeMultipleFiles,
  deleteBlobUrl,
  StorageError,
} from "@/lib/storage";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { slugify } from "@/lib/utils";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

const EVENT_FORM_KEYS = ["title", "titleAr", "description", "descriptionAr", "eventDate"];

function parseImageUrls(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter((item): item is string => typeof item === "string");
  }
  return [];
}

async function uniqueEventSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "event";
  let suffix = 0;
  while (true) {
    const candidate = suffix ? `${base}-${suffix}` : base;
    const existing = await db.event.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
  }
}

async function parseEventForm(formData: FormData, existingImages: string[] = []) {
  const titleAr = String(formData.get("titleAr") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || titleAr;

  let images = [...existingImages];

  if (formData.get("removeImages") === "on") {
    for (const url of images) await deleteBlobUrl(url);
    images = [];
  } else {
    const imageFiles = formData.getAll("images") as File[];
    const validImages = imageFiles.filter((f) => f && f.size > 0);
    if (validImages.length) {
      const stored = await storeMultipleFiles(validImages, "events");
      images = [...images, ...stored.map((file) => file.url)];
    }
  }

  return {
    title,
    titleAr: titleAr || title,
    description: String(formData.get("description") ?? "").trim() || title,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || String(formData.get("description") ?? "").trim() || titleAr,
    eventDate: new Date(String(formData.get("eventDate") ?? "")),
    images: images.length ? images : undefined,
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createEvent(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, EVENT_FORM_KEYS);
  }

  try {
    const parsed = await parseEventForm(formData);
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "اسم الفعالية مطلوب", "Event name is required") } },
        formData,
        EVENT_FORM_KEYS
      );
    }
    if (Number.isNaN(parsed.eventDate.getTime())) {
      return withFormValues(
        { ok: false, fieldErrors: { eventDate: t(locale, "تاريخ الفعالية مطلوب", "Event date is required") } },
        formData,
        EVENT_FORM_KEYS
      );
    }

    const slug = await uniqueEventSlug(parsed.titleAr || parsed.title);
    const event = await db.event.create({
      data: { ...parsed, slug, type: "ACTIVITY" },
    });

    await createAuditLog({ action: "CREATE", entity: "Event", entityId: event.id, details: { title: event.title } });
    revalidatePath(`/${locale}/admin/events`);
    revalidatePath(`/${locale}/activities`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues({ ok: false, error: error.message }, formData, EVENT_FORM_KEYS);
    }
    console.error("createEvent:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر حفظ الفعالية", "Could not save event") }, formData, EVENT_FORM_KEYS);
  }
}

export async function updateEvent(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, EVENT_FORM_KEYS);
  }

  try {
    const existing = await db.event.findUnique({ where: { id } });
    if (!existing) {
      return withFormValues({ ok: false, error: t(locale, "الفعالية غير موجودة", "Event not found") }, formData, EVENT_FORM_KEYS);
    }

    const parsed = await parseEventForm(formData, parseImageUrls(existing.images));
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "اسم الفعالية مطلوب", "Event name is required") } },
        formData,
        EVENT_FORM_KEYS
      );
    }
    if (Number.isNaN(parsed.eventDate.getTime())) {
      return withFormValues(
        { ok: false, fieldErrors: { eventDate: t(locale, "تاريخ الفعالية مطلوب", "Event date is required") } },
        formData,
        EVENT_FORM_KEYS
      );
    }

    const event = await db.event.update({
      where: { id },
      data: {
        ...parsed,
        slug: await uniqueEventSlug(parsed.titleAr || parsed.title, id),
      },
    });

    await createAuditLog({ action: "UPDATE", entity: "Event", entityId: id, details: { title: event.title } });
    revalidatePath(`/${locale}/admin/events`);
    revalidatePath(`/${locale}/activities`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    if (error instanceof StorageError) {
      return withFormValues({ ok: false, error: error.message }, formData, EVENT_FORM_KEYS);
    }
    console.error("updateEvent:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر تحديث الفعالية", "Could not update event") }, formData, EVENT_FORM_KEYS);
  }
}

export type DeleteEventResult = { ok: true } | { ok: false; error: string };

export async function deleteEventAction(id: string, locale: string): Promise<DeleteEventResult> {
  const isAr = locale === "ar";
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  try {
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return { ok: false, error: isAr ? "الفعالية غير موجودة" : "Event not found" };

    for (const url of parseImageUrls(event.images)) {
      await deleteBlobUrl(url);
    }

    await db.event.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "Event", entityId: id });
    revalidatePath(`/${locale}/admin/events`);
    revalidatePath(`/${locale}/activities`);
    revalidatePath(`/${locale}`);
    return { ok: true };
  } catch (error) {
    console.error("deleteEventAction:", error);
    return { ok: false, error: isAr ? "تعذر حذف الفعالية" : "Could not delete event" };
  }
}
