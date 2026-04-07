import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 transformation pour le front (items → produits)
function formatCommande(cmd: any) {
  return {
    id: cmd.id,
    client: cmd.client,
    total: cmd.total,
    statut: cmd.statut,
    date: cmd.date,

    produits: cmd.items.map((item: any) => ({
      id: item.produitId,
      nom: item.nom,
      prix: item.prix,
      image: item.image,
      quantite: item.quantite,
    })),
  };
}

// 🔹 GET
export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
      include: {
        client: true,
        items: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(commandes.map(formatCommande));
  } catch (error) {
    console.error("❌ GET commandes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 POST
export async function POST(req: Request) {
  try {
    const { client, items } = await req.json();

    if (
      !client?.nom ||
      !client?.email ||
      !client?.telephone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Client et items requis." },
        { status: 400 }
      );
    }

    // ✅ créer ou update client
    const clientCreated = await prisma.client.upsert({
      where: { email: client.email },
      update: { nom: client.nom, telephone: client.telephone },
      create: {
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
      },
    });

    // ✅ récupérer produits
    const produitsIds = items.map((i: any) => i.produitId);
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitsIds } },
    });

    if (produits.length === 0) {
      return NextResponse.json(
        { error: "Produits introuvables." },
        { status: 400 }
      );
    }

    // ✅ calcul total
    const total = produits.reduce((sum, p) => {
      const item = items.find((i: any) => i.produitId === p.id);
      return sum + p.prix * (item?.quantite || 1);
    }, 0);

    // ✅ création commande avec snapshot
    const newCommande = await prisma.commande.create({
      data: {
        clientId: clientCreated.id,
        total,
        statut: "En attente",

        items: {
          create: items.map((i: any) => {
            const produit = produits.find(p => p.id === i.produitId);

            if (!produit) {
              throw new Error("Produit introuvable");
            }

            return {
              produitId: produit.id,
              quantite: i.quantite || 1,

              // 🔥 SNAPSHOT OBLIGATOIRE
              nom: produit.nom,
              prix: produit.prix,
              image: produit.images?.[0] || null,
            };
          }),
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(formatCommande(newCommande), { status: 201 });

  } catch (error) {
    console.error("❌ POST commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 PATCH (update statut)
export async function PATCH(req: Request) {
  try {
    const { id, statut } = await req.json();

    if (!id || !statut) {
      return NextResponse.json(
        { error: "ID et statut requis." },
        { status: 400 }
      );
    }

    const updated = await prisma.commande.update({
      where: { id },
      data: { statut },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(formatCommande(updated));
  } catch (error) {
    console.error("❌ PATCH commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 DELETE
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    await prisma.commande.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Commande supprimée" });

  } catch (error) {
    console.error("❌ DELETE commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}   







































/*import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔹 GET → Liste toutes les commandes (avec client et produits)
export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
      include: {
        client: true,  
        items: {
          include: { produit: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(commandes);
  } catch (error) {
    console.error("❌ Erreur GET commandes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 POST → Créer une nouvelle commande avec client complet
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { client, items } = data; // client = { nom, email, telephone }

    // ✅ Validation basique
    if (
      !client?.nom ||
      !client?.email ||
      !client?.telephone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { error: "Coordonnées du client et items sont requis." },
        { status: 400 }
      );
    }

    // ✅ Crée ou met à jour le client (via email unique)
    const clientCreated = await prisma.client.upsert({
      where: { email: client.email },
      update: { nom: client.nom, telephone: client.telephone },
      create: {
        nom: client.nom,
        email: client.email,
        telephone: client.telephone,
      },
    });

    // ✅ Calcul automatique du total
    const produitsIds = items.map((i: any) => i.produitId);
    const produits = await prisma.produit.findMany({
      where: { id: { in: produitsIds } },
    });

    if (produits.length === 0) {
      return NextResponse.json(
        { error: "Aucun produit valide trouvé." },
        { status: 400 }
      );
    }

    const total = produits.reduce((sum, p) => {
      const item = items.find((i: any) => i.produitId === p.id);
      return sum + p.prix * (item?.quantite || 1);
    }, 0);

    // ✅ Création de la commande
    const newCommande = await prisma.commande.create({
      data: {
        clientId: clientCreated.id,
        total,
        statut: "En attente",
        items: {
          create: items.map((i: any) => ({
            produitId: i.produitId,
            quantite: i.quantite || 1,
          })),
        },
      },
      include: {
        client: true,
        items: { include: { produit: true } },
      },
    });

    return NextResponse.json(newCommande, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur POST commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 PATCH → Met à jour le statut d’une commande
export async function PATCH(req: Request) {
  try {
    const { id, statut } = await req.json();

    if (!id || !statut) {
      return NextResponse.json(
        { error: "ID et statut sont requis." },
        { status: 400 }
      );
    }

    // ✅ Vérifie que la commande existe
    const existing = await prisma.commande.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }

    const updated = await prisma.commande.update({
      where: { id },
      data: { statut },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ Erreur PATCH commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// 🔹 DELETE → Supprimer une commande + ses items
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant." }, { status: 400 });
    }

    // ✅ Vérifie existence
    const existing = await prisma.commande.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
    }

    // ✅ Supprime d'abord les items liés
    await prisma.commandeItem.deleteMany({ where: { commandeId: id } });

    // ✅ Supprime la commande
    await prisma.commande.delete({ where: { id } });

    return NextResponse.json({ message: "Commande supprimée avec succès." });
  } catch (error) {
    console.error("❌ Erreur DELETE commande :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
*/
