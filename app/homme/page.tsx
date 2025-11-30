"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  imageUrl?: string;
  nom: string;
  marque?: string;
  prix: number;
  categorie?: string;
  createdAt: string;
}

export default function HommePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [marqueFilter, setMarqueFilter] = useState("");

  const perPage = 6;

  // Charger les produits Homme depuis l’API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits?categorie=Homme");
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

  // Ajouter au panier
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
    alert(`✅ ${product.nom} a été ajouté au panier !`);
  };

  // Filtres & tri
  let filtered = [...products];
  if (marqueFilter) filtered = filtered.filter((p) => p.marque === marqueFilter);

  if (sort === "price-asc") filtered.sort((a, b) => a.prix - b.prix);
  if (sort === "price-desc") filtered.sort((a, b) => b.prix - a.prix);
  if (sort === "date-new") filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const start = (page - 1) * perPage;
  const visibleProducts = filtered.slice(start, start + perPage);

  const marques = Array.from(new Set(products.map((p) => p.marque).filter(Boolean)));

  return (
    <main className="px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">
        Collection Homme 👓
      </h1>

      {/* Filtres */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between gap-4">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Trier par...</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
          <option value="date-new">Nouveautés</option>
        </select>

        <select
          value={marqueFilter}
          onChange={(e) => setMarqueFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">Toutes les marques</option>
          {marques.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <button
          onClick={() => { setSort(""); setMarqueFilter(""); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* Produits */}
      {loading ? (
        <p className="text-center text-gray-600">Chargement...</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-center text-gray-600">Aucun produit trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.nom}
                className="h-56 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.nom}</h3>
                {product.marque && (
                  <p className="text-sm text-gray-500">{product.marque}</p>
                )}
                <p className="text-xl font-bold mt-2">{product.prix} €</p>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>

        <button
          disabled={visibleProducts.length < perPage}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-gray-300 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </main>
  );
}
