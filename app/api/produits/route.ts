import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Catégories exactes
const CATEGORIES_AUTORISEES = [
  "Homme",
  "Femme",
  "Enfant",
  "Lentilles",
  "Solaire Homme",
  "Solaire Femme",
];

// =========================================
// 🔹 GET → Récupérer les produits
// =========================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorie = searchParams.get("categorie");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;

    if (categorie && !CATEGORIES_AUTORISEES.includes(categorie)) {
      return NextResponse.json(
        { error: "Catégorie invalide" },
        { status: 400 }
      );
    }

    // Tri
    let orderBy: any = { createdAt: "desc" };
    if (sort === "prix-asc") orderBy = { prix: "asc" };
    if (sort === "prix-desc") orderBy = { prix: "desc" };

    // Filtre
    let where: any = {};
    if (categorie) where.categorie = categorie;

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const produits = await prisma.produit.findMany({
      where,
      orderBy,
      take: limit,
    });

    return NextResponse.json(produits);
  } catch (error) {
    console.error("Erreur GET produits :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// =========================================
// 🔹 POST → Ajouter un produit
// =========================================
interface ProduitBody {
  nom: string;
  description?: string;
  prix: number;
  categorie?: string;
  stock?: number;
  images?: string[];
}

export async function POST(req: Request) {
  try {
    const data: ProduitBody = await req.json();
    const { nom, description, prix, categorie, stock, images } = data;

    if (!nom || prix === undefined || prix === null) {
      return NextResponse.json(
        { error: "Les champs 'nom' et 'prix' sont obligatoires" },
        { status: 400 }
      );
    }

    if (categorie && !CATEGORIES_AUTORISEES.includes(categorie)) {
      return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });
    }

    if (!images || images.length < 1 || images.length > 5) {
      return NextResponse.json(
        { error: "Veuillez ajouter entre 1 et 5 images" },
        { status: 400 }
      );
    }

    const newProduit = await prisma.produit.create({
      data: {
        nom,
        description: description || null,
        prix: Number(prix),
        categorie: categorie || null,
        stock: stock ?? 0,
        images,
      },
    });

    return NextResponse.json(newProduit, { status: 201 });
  } catch (error) {
    console.error("Erreur POST produit :", error);
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

    await prisma.produit.delete({ where: { id } });
    return NextResponse.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE produit :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}  