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

export default function EnfantsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [marqueFilter, setMarqueFilter] = useState("");

  const perPage = 6;
  const totalPages = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/produits?categorie=Enfant");
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
    alert(`✅ ${product.nom} a été ajouté au panier !`);
  };

  // TRI & FILTRE
  let filtered = [...products];
  if (marqueFilter) filtered = filtered.filter((p) => p.marque === marqueFilter);
  if (sort === "price-asc") filtered.sort((a, b) => a.prix - b.prix);
  if (sort === "price-desc") filtered.sort((a, b) => b.prix - a.prix);
  if (sort === "date-new")
    filtered.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  // PAGINATION
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const visibleProducts = filtered.slice(start, end);

  const marques = Array.from(new Set(products.map((p) => p.marque).filter(Boolean)));

  return (
    <main className="px-6 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-10">
        Collection Enfants 🕶️
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* Produits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center col-span-3">Chargement...</p>
        ) : visibleProducts.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            Aucun produit trouvé
          </p>
        ) : (
          visibleProducts.map((product) => (
            <Link
              key={product.id}
              href={`/enfants/${product.id}`}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden block"
            >
              <img
                src={product.imageUrl || "/images/default.jpg"}
                alt={product.nom}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.nom}</h3>
                <p className="text-gray-500 text-sm">{product.marque || "-"}</p>
                <p className="text-blue-600 font-bold text-lg mt-2">{product.prix} €</p>

                {/* Bouton Ajouter au panier (clic indépendant) */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // empêche l’ouverture du lien
                    addToCart(product);
                  }}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Ajouter au panier
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`px-4 py-2 rounded-lg ${
              page === num
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-100"
            } transition`}
          >
            {num}
          </button>
        ))}
      </div>
    </main>
  );
}
