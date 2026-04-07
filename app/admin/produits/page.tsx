"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Produit {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  categorie?: string;
  stock?: number;
  images?: string[]; // optionnel, pour éviter undefined
}

export default function ProduitsPage() {
  const router = useRouter();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [chargement, setChargement] = useState(true);
  const [categorie, setCategorie] = useState("");
  const [erreur, setErreur] = useState("");
  const [search, setSearch] = useState("");

  // Récupérer searchParams côté client depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get("search") ?? "");
  }, []);

  // Fetch des produits
  useEffect(() => {
    const fetchProduits = async () => {
      setChargement(true);
      setErreur("");
      try {
        const url = new URL("/api/produits", window.location.origin);
        if (categorie) url.searchParams.set("categorie", categorie);
        if (search) url.searchParams.set("search", search);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur serveur");
        }

        setProduits(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setErreur("Impossible de charger les produits.");
      } finally {
        setChargement(false);
      }
    };

    fetchProduits();
  }, [categorie, search]);

  const supprimerProduit = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;

    try {
      const res = await fetch("/api/produits", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProduits(produits.filter((p) => p.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
  };

  const modifierProduit = (id: string) => {
    router.push(`/admin/produits/modifier/${id}`);
  };

  return (
    <div className="p-6 bg-white text-black rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Produits</h1>
        <button
          onClick={() => router.push("/admin/produits/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Ajouter un produit
        </button>
      </div>

      {/* Filtre */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Filtrer par catégorie :</label>
        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-black bg-white"
        >
          <option value="">Toutes</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Enfant">Enfant</option>
          <option value="Lentilles">Lentilles</option>
        </select>
      </div>

      {/* Erreur */}
      {erreur && <div className="mb-4 text-red-600 font-medium">{erreur}</div>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg text-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Image</th>
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Prix</th>
              <th className="py-2 px-4 text-left">Catégorie</th>
              <th className="py-2 px-4 text-left">Stock</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {chargement ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : produits.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              produits.map((produit) => (
                <tr key={produit.id} className="border-t hover:bg-gray-50">
                  {/* Image */}
                  <td className="py-2 px-4">
                    <img
                      src={produit.images?.[0] || "/images/default.jpg"}
                      alt={produit.nom}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="py-2 px-4">{produit.nom}</td>
                  <td className="py-2 px-4">{produit.description || "-"}</td>
                  <td className="py-2 px-4">{produit.prix} DA</td>
                  <td className="py-2 px-4">{produit.categorie || "-"}</td>
                  <td className="py-2 px-4">{produit.stock ?? 0}</td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <button
                      onClick={() => modifierProduit(produit.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => supprimerProduit(produit.id)}
                      className="text-red-600 hover:underline"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}  