/** Admin panel idle timeout — require re-login after this many seconds away. */
export const ADMIN_IDLE_SECONDS = 10 * 60;

export const ADMIN_LAST_ACTIVITY_COOKIE = "admin-last-activity";

export function isAdminIdleExpired(lastActivityMs: number, nowMs = Date.now()): boolean {
  return nowMs - lastActivityMs > ADMIN_IDLE_SECONDS * 1000;
}

export function clearAuthCookies(response: { cookies: { delete: (name: string) => void } }) {
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete(ADMIN_LAST_ACTIVITY_COOKIE);
}

export async function getAdminLastActivityMs(): Promise<number | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const raw = cookieStore.get(ADMIN_LAST_ACTIVITY_COOKIE)?.value;
  if (!raw) return null;
  const value = Number(raw);
  return Number.isNaN(value) ? null : value;
}

export async function assertAdminNotIdle(): Promise<void> {
  const lastActivity = await getAdminLastActivityMs();
  if (lastActivity !== null && isAdminIdleExpired(lastActivity)) {
    throw new Error("session-expired");
  }
}

export async function touchAdminActivity(): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_LAST_ACTIVITY_COOKIE, String(Date.now()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_IDLE_SECONDS,
    path: "/",
  });
}
