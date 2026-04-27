import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// =========================================
// 🔹 GET → Récupérer UN produit
// =========================================
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

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
    console.error("🔥 GET PRODUIT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// =========================================
// 🔹 PUT → Modifier produit
// =========================================
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const updated = await prisma.produit.update({
      where: { id },
      data: {
        nom: body.nom,
        description: body.description ?? null,
        prix: Number(body.prix),
        categorie: body.categorie,
        stock: Number(body.stock ?? 0),
        images: body.images ?? [],
      },
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error("🔥 UPDATE PRODUIT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur update produit" },
      { status: 500 }
    );
  }
}

// =========================================
// 🔹 DELETE → Supprimer produit
// =========================================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    await prisma.produit.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Produit supprimé avec succès",
    });

  } catch (error) {
    console.error("🔥 DELETE PRODUIT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur suppression produit" },
      { status: 500 }
    );
  }
}  