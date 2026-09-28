import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./lib/auth";

// Proxy (formerly middleware) — Next.js 16. Runs in the Node.js runtime by
// default, so node:crypto in verifySession is available.
//
// Guards:
//  - /admin/**            → require a valid session, else redirect to login
//  - mutating /api/**     → require a valid session, else 401 JSON
// GET API calls stay public so the site can read products/blog.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = verifySession(token);

  // Protect the dashboard (but not the login page or its auth API).
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect mutating API calls. GETs are public.
  const isMutation = request.method !== "GET" && request.method !== "HEAD" && request.method !== "OPTIONS";
  const isProtectedApi =
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/blog") ||
    pathname.startsWith("/api/partners") ||
    pathname.startsWith("/api/content");
  if (isProtectedApi && isMutation && !authed) {
    return NextResponse.json({ error: "Niet geautoriseerd" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/blog/:path*", "/api/partners/:path*", "/api/content/:path*"],
};
