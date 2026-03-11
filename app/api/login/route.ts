import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Récupération des données du body
    const { email, password } = await req.json();

    // Vérification que l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Vérification du mot de passe
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 401 }
      );
    }

    // Génération du token JWT avec id et rôle
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // On peut aussi stocker le token côté cookie si besoin
    const response = NextResponse.json({
      message: "Connexion réussie",
      token,
      role: user.role, // optionnel, pratique côté front
    });

    // Exemple: stocker le token dans un cookie httpOnly
    // response.cookies.set("token", token, { httpOnly: true, path: "/" });

    return response;
  } catch (err) {
    console.error("Erreur login:", err);
    return NextResponse.json(
      { message: "Erreur serveur" },
      { status: 500 }
    );
  }
}