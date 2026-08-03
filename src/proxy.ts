import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { verifyGuestToken } from "@/lib/guest-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Rutas admin ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login") || pathname.startsWith("/admin/reset")) {
      return NextResponse.next();
    }
    const token = request.cookies.get("admin_session")?.value;
    const valid = token ? await verifySessionToken(token) : false;
    if (!valid) return NextResponse.redirect(new URL("/admin/login", request.url));
    return NextResponse.next();
  }

  // ── Rutas de invitado ────────────────────────────────────────────────────
  if (pathname.startsWith("/invitado")) {
    if (pathname.startsWith("/invitado/login")) {
      return NextResponse.next();
    }
    const token   = request.cookies.get("guest_session")?.value;
    const payload = token ? await verifyGuestToken(token) : null;
    if (!payload) return NextResponse.redirect(new URL("/invitado/login", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/invitado/:path*"],
};
