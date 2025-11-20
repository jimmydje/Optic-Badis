import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * 🔹 GET → Récupérer tous les clients avec leurs commandes
 */
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        commandes: {
          select: {
            id: true,
            total: true,
            statut: true,
            date: true,
          },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("❌ Erreur GET clients :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * 🔹 POST → Créer ou mettre à jour un client
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nom, email, telephone } = data;

    if (!nom || !email) {
      return NextResponse.json(
        { error: "Les champs nom et email sont requis." },
        { status: 400 }
      );
    }

    const client = await prisma.client.upsert({
      where: { email },
      update: { nom, telephone },
      create: { nom, email, telephone },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur POST client :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * 🔹 PATCH → Modifier un client existant
 */
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json(
        { error: "ID du client manquant." },
        { status: 400 }
      );
    }

    const client = await prisma.client.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("❌ Erreur PATCH client :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * 🔹 DELETE → Supprimer un client (et ses commandes si besoin)
 */
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID du client manquant." },
        { status: 400 }
      );
    }

    // Supprimer d'abord les commandes du client (si tu veux garder la cohérence)
    await prisma.commandeItem.deleteMany({
      where: { commande: { clientId: id } },
    });
    await prisma.commande.deleteMany({ where: { clientId: id } });

    // Puis supprimer le client
    await prisma.client.delete({ where: { id } });

    return NextResponse.json({ message: "Client supprimé avec succès." });
  } catch (error) {
    console.error("❌ Erreur DELETE client :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
