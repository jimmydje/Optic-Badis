import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const hashed = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashed,
      role: "admin",
    } as any,
  });

  return NextResponse.json({ message: "Admin créé ✔" });
}
