import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // NE PAS protéger la page de login admin
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      if (decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
