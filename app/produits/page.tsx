import prisma from "@/lib/prisma";

interface Props {
  searchParams: {
    search?: string;
  };
}

export default async function ProduitsPage({ searchParams }: Props) {
  const search = searchParams.search;

  const produits = await prisma.produit.findMany({
    where: search
      ? {
          OR: [
            {
              nom: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {},
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">
        Résultats pour : {search}
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {produits.map((produit) => (
          <div key={produit.id} className="border p-4 rounded-lg">
            <img
              src={produit.imageUrl || ""}
              alt={produit.nom}
              className="h-40 w-full object-cover"
            />
            <h2 className="mt-2 font-semibold">{produit.nom}</h2>
            <p>{produit.prix} DA</p>
          </div>
        ))}
      </div>
    </div>
  );
}