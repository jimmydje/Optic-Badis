"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  images: string[];
  nom: string;
  marque?: string;
  prix: number;
  categorie?: string;
}

/* 🔥 Mapping des routes (TRÈS IMPORTANT) */
function getProductLink(p: Product) {
  const cat = p.categorie?.toLowerCase() || "";

  // catégories simples
  if (cat === "enfant" || cat === "enfants") return `/enfants/${p.id}`;
  if (cat === "homme" || cat === "hommes") return `/homme/${p.id}`;
  if (cat === "femme" || cat === "femmes") return `/femme/${p.id}`;

  // solaire (sous catégories)
  if (cat === "solaire homme") return `/solaire/hommes/${p.id}`;
  if (cat === "solaire femme") return `/solaire/femmes/${p.id}`;

  // fallback (au cas où)
  return `/${cat}/${p.id}`;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/produits?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchProducts();
    else setLoading(false);
  }, [query]);

  return (
    <main className="min-h-screen bg-white text-[#212E53] px-6 py-20">

      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-10 text-center">
        Résultats pour : <span>"{query}"</span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {products.map((p) => (
            <Link key={p.id} href={getProductLink(p)}>

              <div className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer">

                {/* IMAGE */}
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={p.images?.[0] || "/placeholder.jpg"}
                    alt={p.nom}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="font-semibold">
                    {p.nom}
                  </h3>

                  {p.marque && (
                    <p className="text-sm text-gray-500">
                      {p.marque}
                    </p>
                  )}

                  <p className="mt-2 font-bold">
                    {p.prix} DA
                  </p>
                </div>

                {/* BAR */}
                <div className="bg-[#212E53] text-white text-xs px-4 py-2">
                  Paiement à la livraison
                </div>

              </div>

            </Link>
          ))}

        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-[#212E53] px-6 py-20 text-center">
          Chargement...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}  