import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type LocalSchoolResult = {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  academicYear: string | null;
  semester: string | null;
  category: string | null;
  fileUrl: string;
  fileType: string;
  isPublished: boolean;
  createdAt: string;
};

const RESULTS_FILE = path.join(process.cwd(), "data", "local-results.json");

async function readResults(): Promise<LocalSchoolResult[]> {
  try {
    const raw = await readFile(RESULTS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as LocalSchoolResult[];
    return parsed.map((item) => ({
      ...item,
      title: item.title ?? (item as { studentName?: string }).studentName ?? "Result",
      titleAr: item.titleAr ?? (item as { studentNameAr?: string }).studentNameAr ?? null,
    }));
  } catch {
    return [];
  }
}

async function writeResults(results: LocalSchoolResult[]) {
  await mkdir(path.dirname(RESULTS_FILE), { recursive: true });
  await writeFile(RESULTS_FILE, JSON.stringify(results, null, 2), "utf-8");
}

export async function addLocalResult(data: Omit<LocalSchoolResult, "id" | "createdAt">) {
  const results = await readResults();
  const entry: LocalSchoolResult = {
    ...data,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  results.unshift(entry);
  await writeResults(results);
  return entry;
}

export async function getLocalPublishedResults() {
  const results = await readResults();
  return results.filter((r) => r.isPublished);
}

export async function deleteLocalResult(id: string) {
  const results = await readResults();
  await writeResults(results.filter((r) => r.id !== id));
}
