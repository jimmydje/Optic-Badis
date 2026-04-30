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
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <h1 className="text-3xl font-semibold mb-8">
        Résultats pour : "{query}"
      </h1>

      {loading ? (
        <p>Chargement...</p>
      ) : products.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link key={p.id} href={`/${p.categorie}/${p.id}`}>
              <div className="bg-neutral-900 p-4 rounded-xl hover:bg-neutral-800 transition">
                <img
                  src={p.images?.[0] || "/placeholder.jpg"}
                  alt={p.nom}
                  className="h-48 w-full object-cover mb-3 rounded"
                />
                <h3 className="font-medium">{p.nom}</h3>
                {p.marque && <p className="text-sm text-neutral-400">{p.marque}</p>}
                <p className="font-semibold mt-2">{p.prix} DA</p>
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
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 text-white px-6 py-20">Chargement...</div>}>
      <SearchContent />
    </Suspense>
  );
}  