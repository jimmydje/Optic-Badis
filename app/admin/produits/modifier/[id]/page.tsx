"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Produit {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  categorie?: string;
  stock?: number;
  images?: string[];
}

export default function ModifierProduitPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [produit, setProduit] = useState<Produit>({
    id: "",
    nom: "",
    description: "",
    prix: 0,
    categorie: "",
    stock: 0,
    images: [],
  });

  // 🔽 GET PRODUIT
  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await fetch(`/api/produits/${id}`);
        const data = await res.json();

        setProduit(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  // 🔽 UPDATE
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    await fetch(`/api/produits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produit),
    });

    setSaving(false);
    alert("Produit modifié ✔");
    router.push("/admin/produits");
  };

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white text-black rounded-lg shadow space-y-6">

      <h1 className="text-2xl font-bold">✏ Modifier Produit</h1>

      <form onSubmit={handleUpdate} className="space-y-5">

        {/* IMAGE PREVIEW */}
        <div>
          <label className="font-medium">Image du produit</label>

          {produit.images?.length ? (
            <div className="mt-2">
              <Image
                src={produit.images[0]}
                alt={produit.nom}
                width={250}
                height={250}
                className="rounded border object-cover"
              />
            </div>
          ) : (
            <p className="text-gray-500">Aucune image disponible</p>
          )}
        </div>

        {/* NOM */}
        <div>
          <label className="font-medium">Nom du produit</label>
          <input
            value={produit.nom}
            onChange={(e) =>
              setProduit({ ...produit, nom: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="font-medium">Description</label>
          <textarea
            value={produit.description || ""}
            onChange={(e) =>
              setProduit({ ...produit, description: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* PRIX */}
        <div>
          <label className="font-medium">Prix (DA)</label>
          <input
            type="number"
            value={produit.prix}
            onChange={(e) =>
              setProduit({ ...produit, prix: Number(e.target.value) })
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* CATEGORIE */}
        <div>
          <label className="font-medium">Catégorie</label>
          <select
            value={produit.categorie || ""}
            onChange={(e) =>
              setProduit({ ...produit, categorie: e.target.value })
            }
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Choisir une catégorie</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Enfant">Enfant</option>
            <option value="Lentilles">Lentilles</option>
          </select>
        </div>

        {/* STOCK */}
        <div>
          <label className="font-medium">Stock disponible</label>
          <input
            type="number"
            value={produit.stock || 0}
            onChange={(e) =>
              setProduit({ ...produit, stock: Number(e.target.value) })
            }
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </button>

      </form>
    </div>
  );
}  