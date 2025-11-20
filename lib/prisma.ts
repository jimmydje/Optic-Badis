import { PrismaClient } from "@prisma/client";

declare global {
  // Empêche la recréation du client Prisma à chaque rechargement (en dev)
  var prisma: PrismaClient | undefined;
}

// Crée un seul client Prisma pour tout le projet
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// En dev, conserve l’instance Prisma dans la variable globale
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
