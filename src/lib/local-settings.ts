import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "data", "local-settings.json");

export async function getLocalSetting(key: string): Promise<string | null> {
  try {
    const raw = await readFile(SETTINGS_FILE, "utf-8");
    const data = JSON.parse(raw) as Record<string, string>;
    return data[key] ?? null;
  } catch {
    return null;
  }
}

export async function setLocalSetting(key: string, value: string) {
  await mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(await readFile(SETTINGS_FILE, "utf-8"));
  } catch {
    // start fresh
  }
  data[key] = value;
  await writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf-8");
}
