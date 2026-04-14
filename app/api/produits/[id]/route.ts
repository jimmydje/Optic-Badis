import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 GET
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ IMPORTANT FIX

  if (!id) {
    return NextResponse.json(
      { error: "ID manquant" },
      { status: 400 }
    );
  }

  try {
    const produit = await prisma.produit.findUnique({
      where: { id }, // ✅ PLUS undefined
    });

    if (!produit) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(produit);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// 🔹 PUT
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX IMPORTANT

  if (!id) {
    return NextResponse.json(
      { error: "ID manquant" },
      { status: 400 }
    );
  }

  const body = await req.json();

  try {
    const updated = await prisma.produit.update({
      where: { id }, // ✅ FIX
      data: {
        nom: body.nom,
        description: body.description ?? null,
        prix: Number(body.prix),
        categorie: body.categorie,
        stock: Number(body.stock),
        images: body.images,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur update produit" },
      { status: 500 }
    );
  }
}

// 🔹 DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ FIX

  try {
    await prisma.produit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produit supprimé" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    );
  }
}  