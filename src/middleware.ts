import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { i18n, Locale } from "./i18n.config";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { Routes } from "./constants/enums";
import { UserRole } from "@/generated/prisma";
import { isAdminRole } from "@/lib/permissions";

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

export default withAuth(
  async function middleware(request: NextRequest) {
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

    if (isAuth && isAuthPage) {
      const role = isAuth.role as UserRole;
      if (isAdminRole(role)) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url)
        );
      }
    }

    if (isAuth && isAdminPage) {
      const role = isAuth.role as UserRole;
      if (!isAdminRole(role)) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}`, request.url)
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|icons).*)",
  ],
};
