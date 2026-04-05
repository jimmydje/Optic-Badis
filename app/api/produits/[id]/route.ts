import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CATEGORIES_AUTORISEES = [
  "Homme",
  "Femme",
  "Enfant",
  "Lentilles",
  "solaire.homme",
  "solaire.femme",
];  
 
// 🔹 GET
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const produit = await prisma.produit.findUnique({
      where: { id },
    });

    if (!produit) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(produit);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 PUT
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  if (
    body.categorie &&
    !CATEGORIES_AUTORISEES.includes(body.categorie)
  ) {
    return NextResponse.json(
      { error: "Catégorie invalide" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.produit.update({
      where: { id },
      data: {
        nom: body.nom,
        description: body.description ?? null,
        prix: body.prix ? Number(body.prix) : undefined,
        categorie: body.categorie ?? undefined,
        stock: body.stock ?? undefined,
        images: body.images ?? undefined, // ✅ IMPORTANT (tableau)
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await prisma.produit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produit supprimé" });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}