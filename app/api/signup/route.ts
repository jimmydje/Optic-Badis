import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ message: "Email déjà utilisé" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({ data: { email, password: hashed } });

    return NextResponse.json({ message: "Compte créé !" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}