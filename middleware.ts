import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Autoriser la page de login admin
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // 🔐 Protéger tout /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token");

    // ❌ Pas connecté → retour login
    if (!token) {
      return NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

// 👇 Appliquer seulement sur /admin
export const config = {
  matcher: ["/admin/:path*"],
};
