export type AppRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "TEACHER";

export function isAdminRole(role: string | undefined | null): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN" || role === "EDITOR";
}
