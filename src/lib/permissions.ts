import { UserRole } from "@/generated/prisma";

export type Permission =
  | "dashboard.view"
  | "users.manage"
  | "teachers.manage"
  | "announcements.manage"
  | "articles.manage"
  | "events.manage"
  | "gallery.manage"
  | "results.manage"
  | "downloads.manage"
  | "calendar.manage"
  | "settings.manage"
  | "homepage.manage"
  | "media.manage"
  | "messages.view"
  | "audit.view"
  | "backup.manage";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard.view",
    "users.manage",
    "teachers.manage",
    "announcements.manage",
    "articles.manage",
    "events.manage",
    "gallery.manage",
    "results.manage",
    "downloads.manage",
    "calendar.manage",
    "settings.manage",
    "homepage.manage",
    "media.manage",
    "messages.view",
    "audit.view",
    "backup.manage",
  ],
  ADMIN: [
    "dashboard.view",
    "users.manage",
    "teachers.manage",
    "announcements.manage",
    "articles.manage",
    "events.manage",
    "gallery.manage",
    "results.manage",
    "downloads.manage",
    "calendar.manage",
    "settings.manage",
    "homepage.manage",
    "media.manage",
    "messages.view",
  ],
  EDITOR: [
    "dashboard.view",
    "teachers.manage",
    "announcements.manage",
    "articles.manage",
    "events.manage",
    "gallery.manage",
    "downloads.manage",
    "calendar.manage",
    "media.manage",
    "messages.view",
  ],
  TEACHER: ["dashboard.view", "results.manage"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessAdmin(role: UserRole): boolean {
  return role !== UserRole.TEACHER || ROLE_PERMISSIONS[role].length > 1;
}

export function isAdminRole(role: UserRole): boolean {
  return (
    role === UserRole.SUPER_ADMIN ||
    role === UserRole.ADMIN ||
    role === UserRole.EDITOR
  );
}

export const ADMIN_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN,
  UserRole.ADMIN,
  UserRole.EDITOR,
  UserRole.TEACHER,
];
