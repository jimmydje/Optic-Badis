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

export default function FemmePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [marqueFilter, setMarqueFilter] = useState("");

  const perPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits?categorie=Femme");
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
  if (marqueFilter) filtered = filtered.filter((p) => p.marque === marqueFilter);
  if (sort === "price-asc") filtered.sort((a, b) => a.prix - b.prix);
  if (sort === "price-desc") filtered.sort((a, b) => b.prix - a.prix);
  if (sort === "date-new")
    filtered.sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );

  const start = (page - 1) * perPage;
  const visibleProducts = filtered.slice(start, start + perPage);
  const marques = Array.from(new Set(products.map((p) => p.marque).filter(Boolean)));
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-semibold text-center mb-16">
        Collection Femme
      </h1>

      {/* FILTRES */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row gap-4 justify-between">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        >
          <option value="">Trier par</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="date-new">Nouveautés</option>
        </select>

        <select
          value={marqueFilter}
          onChange={(e) => setMarqueFilter(e.target.value)}
          className="bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white"
        >
          <option value="">Toutes les marques</option>
          {marques.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button
          onClick={() => { setSort(""); setMarqueFilter(""); }}
          className="px-6 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* PRODUITS */}
      {loading ? (
        <p className="text-center text-neutral-400">Chargement...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-neutral-400">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-neutral-900 rounded-3xl overflow-hidden hover:bg-neutral-800 transition"
            >
              <Link href={`/femme/${product.id}`}>
                <img
                  src={product.imageUrl || "/images/default.jpg"}
                  alt={product.nom}
                  className="h-64 w-full object-cover group-hover:scale-105 transition"
                />
              </Link>

              <div className="p-6">
                <Link href={`/femme/${product.id}`}>
                  <h3 className="text-lg font-medium hover:underline">
                    {product.nom}
                  </h3>
                </Link>

                {product.marque && (
                  <p className="text-sm text-neutral-400 mt-1">
                    {product.marque}
                  </p>
                )}

                <p className="text-xl font-semibold mt-3">
                  {product.prix} €
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 transition"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
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
                ? "bg-white text-black"
                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
            } transition`}
          >
            {num}
          </button>
        ))}
      </div>
    </main>
  );
}
