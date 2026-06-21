"use server";

import { db } from "@/lib/prisma";
import { SETTING_KEYS } from "@/constants/site";
import { storeFileDetailed, isAllowedImage, StorageError, resolveMimeType } from "@/lib/storage";
import { setLocalSetting } from "@/lib/local-settings";
import { assertAdminSession } from "@/lib/action-auth";
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
  const isAr = locale === "ar";

  try {
    await assertAdminSession();
  } catch {
    return { ok: false, error: isAr ? "غير مصرح" : "Unauthorized" };
  }

  const file = formData.get("coverImage") as File | null;
  const existingUrl = String(formData.get("existingUrl") ?? "").trim();

  try {
    let imageUrl = existingUrl || null;

    if (file && file.size > 0) {
      const mime = resolveMimeType(file);
      if (!isAllowedImage(mime)) {
        return {
          ok: false,
          error: isAr
            ? "الصيغ المدعومة: JPG, JPEG, PNG, WEBP"
            : "Supported formats: JPG, JPEG, PNG, WEBP",
        };
      }
      const stored = await storeFileDetailed(file, "covers");
      imageUrl = stored.url;
    }

    if (!imageUrl) {
      return {
        ok: false,
        error: isAr ? "يرجى اختيار صورة للغلاف" : "Please select a cover image",
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
    if (error instanceof StorageError) {
      return { ok: false, error: error.message };
    }
    return {
      ok: false,
      error: isAr
        ? "تعذر حفظ صورة الغلاف. حاول مرة أخرى."
        : "Could not save the cover image. Please try again.",
    };
  }
}
