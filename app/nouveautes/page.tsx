"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  nom: string;
  marque?: string;
  prix: number;
  imageUrl?: string;
  categorie: string;
  createdAt: string;
}

export default function NouveautesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Homme", "Femme", "Enfant"];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/produits");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // === Derniers 4 produits par catégorie ===
  const latestByCategory = categories.map((cat) => {
    const catProducts = products
      .filter((p) => p.categorie === cat)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 4);

    return { category: cat, products: catProducts };
  });

  if (loading) {
    return (
      <p className="text-center py-20 text-gray-500">Chargement...</p>
    );
  }

  return (
    <main className="px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">
        Nouveautés
      </h1>

      {latestByCategory.map(({ category, products }) => (
        <section key={category} className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {category}
          </h2>

          {products.length === 0 ? (
            <p className="text-gray-500">Pas de nouveautés pour cette catégorie.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
                >
                  <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.nom}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.nom}</h3>
                    <p className="text-gray-500 text-sm">{product.marque}</p>
                    <p className="text-blue-600 font-bold text-lg mt-2">
                      {product.prix} DA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  );
}
