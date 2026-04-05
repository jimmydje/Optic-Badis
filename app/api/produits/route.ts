import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ✅ Catégories exactes
const CATEGORIES_AUTORISEES = [
  "Homme",
  "Femme",
  "Enfant",
  "Lentilles",
  "solaire.homme",
  "solaire.femme",
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

    // 🔥 FIX limit sécurisé
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : undefined;

    if (categorie && !CATEGORIES_AUTORISEES.includes(categorie)) {
      return NextResponse.json(
        { error: "Catégorie invalide" },
        { status: 400 }
      );
    }

    // 🔥 FIX createdAt (remplacé par id si problème)
    let orderBy: any = { id: "desc" };

    if (sort === "prix-asc") orderBy = { prix: "asc" };
    if (sort === "prix-desc") orderBy = { prix: "desc" };

    // Filtre
    let where: any = {};

    if (categorie) {
      where.categorie = categorie;
    }

    // 🔥 FIX search (évite crash si description null)
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // 🔥 FIX take undefined
    const produits = await prisma.produit.findMany({
      where,
      orderBy,
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json(produits);

  } catch (error) {
    console.error("🔥 ERREUR GET PRODUITS :", error);

    return NextResponse.json(
      { error: String(error) }, // 🔥 très important pour debug
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "Catégorie invalide" },
        { status: 400 }
      );
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
    console.error("🔥 ERREUR POST PRODUIT :", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// =========================================
// 🔹 DELETE → Supprimer un produit
// =========================================
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

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
    console.error("🔥 ERREUR DELETE PRODUIT :", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}  