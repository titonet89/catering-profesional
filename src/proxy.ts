import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas dentro de /admin (no requieren sesión)
  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/reset")
  ) {
    return NextResponse.next();
  }

  // Todo lo demás bajo /admin requiere sesión válida
  const token = request.cookies.get("admin_session")?.value;
  const valid = token ? await verifySessionToken(token) : false;

  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
