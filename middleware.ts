import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // On ne protège que /admin
  if (url.pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      url.pathname = "/auth"; // redirection si pas logué
      return NextResponse.redirect(url);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
      if (decoded.role !== "ADMIN") {
        url.pathname = "/"; // redirection si pas admin
        return NextResponse.redirect(url);
      }
    } catch {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Appliquer le middleware sur /admin
export const config = {
  matcher: ["/admin/:path*"],
};