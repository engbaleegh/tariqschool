import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { getToken } from "next-auth/jwt";
import { i18n, type Locale } from "./i18n.config";
import { Routes } from "./constants/enums";
import { isAdminRole } from "@/lib/roles";
import {
  ADMIN_IDLE_SECONDS,
  ADMIN_LAST_ACTIVITY_COOKIE,
  clearAuthCookies,
  isAdminIdleExpired,
} from "@/lib/admin-session";

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return matchLocale(languages, [...i18n.locales], i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}`)
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  const currentLocale = pathname.split("/")[1] as Locale;
  const isAuth = await getToken({ req: request });
  const isAuthPage = pathname.includes(`/${Routes.AUTH}/`);
  const isAdminPage = pathname.includes(`/${Routes.ADMIN}`);

  if (!isAuth && isAdminPage) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/${Routes.AUTH}/signin`, request.url)
    );
  }

  if (isAuth && isAuthPage && isAdminRole(isAuth.role as string)) {
    return NextResponse.redirect(new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url));
  }

  if (isAuth && isAdminPage && !isAdminRole(isAuth.role as string)) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
  }

  if (isAuth && isAdminPage && isAdminRole(isAuth.role as string)) {
    const lastActivityRaw = request.cookies.get(ADMIN_LAST_ACTIVITY_COOKIE)?.value;
    const now = Date.now();

    if (lastActivityRaw) {
      const lastActivity = Number(lastActivityRaw);
      if (!Number.isNaN(lastActivity) && isAdminIdleExpired(lastActivity, now)) {
        const signInUrl = new URL(`/${currentLocale}/${Routes.AUTH}/signin`, request.url);
        signInUrl.searchParams.set("reason", "session-expired");
        const response = NextResponse.redirect(signInUrl);
        clearAuthCookies(response);
        return response;
      }
    }

    const response = NextResponse.next();
    response.cookies.set(ADMIN_LAST_ACTIVITY_COOKIE, String(now), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ADMIN_IDLE_SECONDS,
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons|uploads).*)",
  ],
};
