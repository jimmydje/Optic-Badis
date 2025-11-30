import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ProduitBody {
  nom: string;
  description?: string;
  prix: number;
  imageUrl?: string | null;
  categorie?: string | null;
  stock?: number;
}

// =========================================
// 🔹 GET → Récupérer les produits
// =========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const sort = searchParams.get("sort");
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;

    // Tri dynamique
    let orderBy: any = { createdAt: "desc" };
    if (sort === "prix-asc") orderBy = { prix: "asc" };
    if (sort === "prix-desc") orderBy = { prix: "desc" };

    const produits = await prisma.produit.findMany({
      where: categorie ? { categorie } : {},
      orderBy,
      take: limit,
    });

    return NextResponse.json(produits);
  } catch (error) {
    console.error("Erreur lors du GET produits :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// =========================================
// 🔹 POST → Ajouter un produit
// =========================================
export async function POST(req: Request) {
  try {
    const data: ProduitBody = await req.json();
    const { nom, description, prix, imageUrl, categorie, stock } = data;

    if (!nom || prix === undefined || prix === null) {
      return NextResponse.json(
        { error: "Les champs 'nom' et 'prix' sont obligatoires" },
        { status: 400 }
      );
    }

    const newProduit = await prisma.produit.create({
      data: {
        nom,
        description: description || null,
        prix: parseFloat(String(prix)),
        imageUrl: imageUrl || null,
        categorie: categorie || null,
        stock: stock ?? 0,
      },
    });

    return NextResponse.json(newProduit, { status: 201 });
  } catch (error) {
    console.error("Erreur lors du POST produit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// =========================================
// 🔹 DELETE → Supprimer un produit
// =========================================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.produit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors du DELETE produit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
