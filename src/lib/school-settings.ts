import { db } from "@/lib/prisma";
import { SETTING_KEYS } from "@/constants/site";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920";

export async function getHeroCoverImage(): Promise<string> {
  try {
    const setting = await db.setting.findUnique({
      where: { key: SETTING_KEYS.HERO_COVER },
    });
    if (setting?.value) return setting.value;

    const banner = await db.homepageBanner.findFirst({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (banner?.image) return banner.image;
  } catch {
    // DB unavailable — use default cover below
  }

  return DEFAULT_COVER;
}
