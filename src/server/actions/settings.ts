"use server";

import { db } from "@/lib/prisma";
import { SETTING_KEYS } from "@/constants/site";
import { storeUploadedFile } from "@/lib/storage";
import { setLocalSetting } from "@/lib/local-settings";
import { revalidatePath } from "next/cache";

export type HeroCoverActionState = {
  ok: boolean;
  error?: string;
  imageUrl?: string;
};

export async function updateHeroCover(
  _prev: HeroCoverActionState,
  formData: FormData
): Promise<HeroCoverActionState> {
  const locale = String(formData.get("locale") ?? "ar");
  const file = formData.get("coverImage") as File | null;
  const existingUrl = String(formData.get("existingUrl") ?? "").trim();

  try {
    let imageUrl = existingUrl || null;

    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        return {
          ok: false,
          error: locale === "ar" ? "حجم الصورة يجب أن يكون أقل من 10 ميجابايت" : "Image must be under 10MB",
        };
      }
      imageUrl = await storeUploadedFile(file, "covers");
    }

    if (!imageUrl) {
      return {
        ok: false,
        error: locale === "ar" ? "يرجى اختيار صورة للغلاف" : "Please select a cover image",
      };
    }

    try {
      await db.setting.upsert({
        where: { key: SETTING_KEYS.HERO_COVER },
        update: { value: imageUrl },
        create: {
          key: SETTING_KEYS.HERO_COVER,
          value: imageUrl,
          group: "homepage",
        },
      });
    } catch {
      await setLocalSetting(SETTING_KEYS.HERO_COVER, imageUrl);
    }

    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/admin/homepage`);

    return { ok: true, imageUrl };
  } catch (error) {
    console.error("updateHeroCover failed:", error);
    return {
      ok: false,
      error:
        locale === "ar"
          ? "تعذر حفظ صورة الغلاف. حاول مرة أخرى."
          : "Could not save the cover image. Please try again.",
    };
  }
}
