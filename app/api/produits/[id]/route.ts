import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ======================================================
// 🔹 GET → Récupérer UN produit par ID
// ======================================================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const produit = await prisma.produit.findUnique({
      where: { id: params.id },
    });

    if (!produit) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json(produit);
  } catch (error) {
    console.error("Erreur GET produit par ID :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ======================================================
// 🔹 PUT → Modifier un produit par ID
// ======================================================
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const updated = await prisma.produit.update({
      where: { id: params.id },
      data: {
        nom: body.nom,
        description: body.description ?? null,
        prix: body.prix !== undefined ? parseFloat(String(body.prix)) : undefined,
        imageUrl: body.imageUrl ?? undefined,
        categorie: body.categorie ?? undefined,
        stock: body.stock ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT produit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ======================================================
// 🔹 DELETE → Supprimer un produit par ID
// ======================================================
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.produit.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE produit par ID :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
