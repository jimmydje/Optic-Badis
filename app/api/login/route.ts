import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "monSecretSuperSecret";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Données manquantes" }, { status: 400 });
  }

  // Chercher l'utilisateur dans la base
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Email incorrect" },
      { status: 400 }
    );
  }

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { message: "Mot de passe incorrect" },
      { status: 400 }
    );
  }

  // Génération du token
  const token = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Stocker le token dans un cookie sécurisé
  const response = NextResponse.json({
    message: "Connexion réussie",
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}
