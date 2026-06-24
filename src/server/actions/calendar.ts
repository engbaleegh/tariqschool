"use server";

import { db } from "@/lib/prisma";
import { EventType } from "@/generated/prisma";
import { createAuditLog } from "@/lib/audit";
import { type FormActionState, t } from "@/lib/action-state";
import { withFormValues } from "@/lib/form-values";
import { assertAdminSession } from "@/lib/action-auth";
import { revalidatePath } from "next/cache";

const CALENDAR_FORM_KEYS = ["title", "titleAr", "description", "descriptionAr", "startDate", "endDate"];

function parseCalendarForm(formData: FormData) {
  const titleAr = String(formData.get("titleAr") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || titleAr;
  const endDateRaw = String(formData.get("endDate") ?? "").trim();

  return {
    title,
    titleAr: titleAr || title,
    description: String(formData.get("description") ?? "").trim() || null,
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim() || null,
    startDate: new Date(String(formData.get("startDate") ?? "")),
    endDate: endDateRaw ? new Date(endDateRaw) : null,
    type: (String(formData.get("type") ?? "GENERAL") as EventType) || EventType.GENERAL,
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createCalendarEntry(
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, CALENDAR_FORM_KEYS);
  }

  try {
    const parsed = parseCalendarForm(formData);
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "عنوان الحدث مطلوب", "Event title is required") } },
        formData,
        CALENDAR_FORM_KEYS
      );
    }
    if (Number.isNaN(parsed.startDate.getTime())) {
      return withFormValues(
        { ok: false, fieldErrors: { startDate: t(locale, "تاريخ البداية مطلوب", "Start date is required") } },
        formData,
        CALENDAR_FORM_KEYS
      );
    }

    const entry = await db.calendarEvent.create({ data: parsed });
    await createAuditLog({ action: "CREATE", entity: "CalendarEvent", entityId: entry.id, details: { title: entry.title } });
    revalidatePath(`/${locale}/admin/calendar`);
    revalidatePath(`/${locale}/calendar`);
    return { ok: true };
  } catch (error) {
    console.error("createCalendarEntry:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر حفظ الحدث", "Could not save calendar event") }, formData, CALENDAR_FORM_KEYS);
  }
}

export async function updateCalendarEntry(
  id: string,
  _prev: FormActionState,
  formData: FormData
): Promise<FormActionState> {
  const locale = String(formData.get("locale") ?? "ar");

  try {
    await assertAdminSession();
  } catch {
    return withFormValues({ ok: false, error: t(locale, "غير مصرح", "Unauthorized") }, formData, CALENDAR_FORM_KEYS);
  }

  try {
    const parsed = parseCalendarForm(formData);
    if (!parsed.titleAr && !parsed.title) {
      return withFormValues(
        { ok: false, fieldErrors: { title: t(locale, "عنوان الحدث مطلوب", "Event title is required") } },
        formData,
        CALENDAR_FORM_KEYS
      );
    }
    if (Number.isNaN(parsed.startDate.getTime())) {
      return withFormValues(
        { ok: false, fieldErrors: { startDate: t(locale, "تاريخ البداية مطلوب", "Start date is required") } },
        formData,
        CALENDAR_FORM_KEYS
      );
    }

    const entry = await db.calendarEvent.update({ where: { id }, data: parsed });
    await createAuditLog({ action: "UPDATE", entity: "CalendarEvent", entityId: id, details: { title: entry.title } });
    revalidatePath(`/${locale}/admin/calendar`);
    revalidatePath(`/${locale}/calendar`);
    return { ok: true };
  } catch (error) {
    console.error("updateCalendarEntry:", error);
    return withFormValues({ ok: false, error: t(locale, "تعذر تحديث الحدث", "Could not update calendar event") }, formData, CALENDAR_FORM_KEYS);
  }
}

export type DeleteCalendarResult = { ok: true } | { ok: false; error: string };

export async function deleteCalendarEntryAction(id: string, locale: string): Promise<DeleteCalendarResult> {
  const isAr = locale === "ar";
  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  try {
    await db.calendarEvent.delete({ where: { id } });
    await createAuditLog({ action: "DELETE", entity: "CalendarEvent", entityId: id });
    revalidatePath(`/${locale}/admin/calendar`);
    revalidatePath(`/${locale}/calendar`);
    return { ok: true };
  } catch (error) {
    console.error("deleteCalendarEntryAction:", error);
    return { ok: false, error: isAr ? "تعذر حذف الحدث" : "Could not delete calendar event" };
  }
}
