export const runtime = "nodejs";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findFirst({
      where: {
        email,
        role: "ADMIN",
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({ success: true });

   res.cookies.set("admin_token", token, {
  httpOnly: true,
  secure: false, // 🔥 IMPORTANT en local
  path: "/",
  maxAge: 60 * 60 * 24,
});


    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
