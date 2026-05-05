"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  imageUrl?: string;
  nom: string;
  marque?: string;
  prix: number;
  categorie?: string;
  createdAt: string;
}

export default function LentillesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [marqueFilter, setMarqueFilter] = useState("");

  const perPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits?categorie=Lentilles");
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existing = localStorage.getItem("cart");
    let cart = existing ? JSON.parse(existing) : [];

    const existingItem = cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantite += 1;
    } else {
      cart.push({
        id: product.id,
        nom: product.nom,
        prix: product.prix,
        quantite: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`✅ ${product.nom} ajouté au panier`);
  };

  let filtered = [...products];

  if (marqueFilter) {
    filtered = filtered.filter((p) => p.marque === marqueFilter);
  }

  if (sort === "price-asc") {
    filtered.sort((a, b) => a.prix - b.prix);
  }

  if (sort === "price-desc") {
    filtered.sort((a, b) => b.prix - a.prix);
  }

  if (sort === "date-new") {
    filtered.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );
  }

  const start = (page - 1) * perPage;
  const visibleProducts = filtered.slice(start, start + perPage);

  const marques = Array.from(
    new Set(products.map((p) => p.marque).filter(Boolean))
  );

  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <main className="min-h-screen bg-neutral-100 text-black px-6 py-20">

      <h1 className="text-4xl md:text-5xl font-semibold text-center mb-16">
        Lentilles de contact
      </h1>

      {/* FILTRES */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-4 justify-between">

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none"
        >
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="date-new">Nouveautés</option>
        </select>

        <select
          value={marqueFilter}
          onChange={(e) => setMarqueFilter(e.target.value)}
          className="bg-white border border-neutral-300 rounded-xl px-4 py-3 text-black focus:outline-none"
        >
          <option value="">Toutes les marques</option>
          {marques.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setSort("");
            setMarqueFilter("");
          }}
          className="px-6 py-3 rounded-xl bg-[#DAAB3A] text-white hover:opacity-90 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* PRODUITS */}
      {loading ? (
        <p className="text-center text-neutral-500">Chargement...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-neutral-500">
          Aucun produit trouvé.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {visibleProducts.map((product) => {
            const imageSrc = product.imageUrl || "/images/default.jpg";

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
              >

                <div className="relative">
                  <Link href={`/lentilles/${product.id}`}>
                    <img
                      src={imageSrc}
                      alt={product.nom}
                      className="h-64 w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </Link>

                  <span className="absolute top-3 left-3 bg-[#DAAB3A] text-white text-xs px-3 py-1 rounded-full">
                    Nouveau
                  </span>
                </div>

                <div className="p-6">
                  <Link href={`/lentilles/${product.id}`}>
                    <h3 className="text-lg font-medium hover:underline">
                      {product.nom}
                    </h3>
                  </Link>

                  {product.marque && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {product.marque}
                    </p>
                  )}

                  <p className="text-xl font-semibold mt-3 text-[#DAAB3A]">
                    {product.prix} DA
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-6 py-3 rounded-full bg-[#DAAB3A] text-white hover:opacity-90 transition"
                  >
                    Ajouter au panier
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-center mt-16 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-4 py-2 rounded-full ${
              page === num
                ? "bg-[#DAAB3A] text-white"
                : "bg-white border border-neutral-300 text-neutral-600 hover:bg-neutral-200"
            } transition`}
          >
            {num}
          </button>
        ))}
      </div>

    </main>
  );
} 