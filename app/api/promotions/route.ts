import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(promotions);
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors du chargement" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nom, description, prix, promotion, imageUrl } = await req.json();

    if (!nom || prix === undefined || promotion === undefined) {
      return NextResponse.json(
        { error: "Nom, prix et promotion sont obligatoires" },
        { status: 400 }
      );
    }

    const newPromo = await prisma.promotion.create({
      data: {
        nom,
        description,
        prix: Number(prix),
        promotion: Number(promotion),
        imageUrl,
      },
    });

    return NextResponse.json(newPromo, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, nom, description, prix, promotion, imageUrl } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const updatedPromo = await prisma.promotion.update({
      where: { id },
      data: {
        nom,
        description,
        prix: Number(prix),
        promotion: Number(promotion),
        imageUrl,
      },
    });

    return NextResponse.json(updatedPromo);
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({ message: "Promotion supprimée" });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
