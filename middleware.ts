import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "monSecretSuperSecret";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Protéger /admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
