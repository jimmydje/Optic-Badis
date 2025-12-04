// app/api/promotions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // si tu utilises Prisma

export async function GET() {
  try {
    const promotions = await prisma.produit.findMany({
      where: { promotion: { not: null } },
    });
    return NextResponse.json(promotions);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Impossible de récupérer les promotions" }, { status: 500 });
  }
}
