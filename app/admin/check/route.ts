import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "TON_SECRET_JWT";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json({ ok: true, user: decoded });
  } catch {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
}
