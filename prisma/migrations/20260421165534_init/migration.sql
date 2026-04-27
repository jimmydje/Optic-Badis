/*
  Warnings:

  - Added the required column `nom` to the `CommandeItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prix` to the `CommandeItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "ville" TEXT;

-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "telephone" TEXT,
ADD COLUMN     "ville" TEXT;

-- AlterTable
ALTER TABLE "CommandeItem" ADD COLUMN     "image" TEXT,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "prix" DOUBLE PRECISION NOT NULL;
