import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type LocalTeacher = {
  id: string;
  fullName: string;
  fullNameAr: string | null;
  photo: string | null;
  jobTitle: string | null;
  jobTitleAr: string | null;
  department: string | null;
  departmentAr: string | null;
  biography: string | null;
  biographyAr: string | null;
  qualifications: string | null;
  qualificationsAr: string | null;
  email: string | null;
  phone: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
};

const TEACHERS_FILE = path.join(process.cwd(), "data", "local-teachers.json");

async function readTeachers(): Promise<LocalTeacher[]> {
  try {
    const raw = await readFile(TEACHERS_FILE, "utf-8");
    return JSON.parse(raw) as LocalTeacher[];
  } catch {
    return [];
  }
}

async function writeTeachers(teachers: LocalTeacher[]) {
  await mkdir(path.dirname(TEACHERS_FILE), { recursive: true });
  await writeFile(TEACHERS_FILE, JSON.stringify(teachers, null, 2), "utf-8");
}

export async function getAllLocalTeachers(): Promise<LocalTeacher[]> {
  return readTeachers();
}

export async function getLocalTeacherById(id: string): Promise<LocalTeacher | null> {
  const teachers = await readTeachers();
  return teachers.find((t) => t.id === id) ?? null;
}

export async function addLocalTeacher(
  data: Omit<LocalTeacher, "id" | "createdAt">
): Promise<LocalTeacher> {
  const teachers = await readTeachers();
  const entry: LocalTeacher = {
    ...data,
    id: `local-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  teachers.push(entry);
  await writeTeachers(teachers);
  return entry;
}

export async function updateLocalTeacher(
  id: string,
  data: Omit<LocalTeacher, "id" | "createdAt">
): Promise<LocalTeacher | null> {
  const teachers = await readTeachers();
  const index = teachers.findIndex((t) => t.id === id);
  if (index === -1) return null;
  teachers[index] = { ...teachers[index], ...data, id, createdAt: teachers[index].createdAt };
  await writeTeachers(teachers);
  return teachers[index];
}

export async function deleteLocalTeacher(id: string): Promise<boolean> {
  const teachers = await readTeachers();
  const filtered = teachers.filter((t) => t.id !== id);
  if (filtered.length === teachers.length) return false;
  await writeTeachers(filtered);
  return true;
}

export function isLocalTeacherId(id: string) {
  return id.startsWith("local-");
}
