"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProduitForm {
  nom: string;
  description: string;
  prix: number | "";
  categorie: string;
  images: string[]; // tableau d’images
  stock: number | "";
}

export default function AjouterProduitPage() {
  const router = useRouter();

  const [produit, setProduit] = useState<ProduitForm>({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    images: [], // vide au départ
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  // Gestion des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "prix") {
      setProduit({ ...produit, prix: value === "" ? "" : Number(value) });
    } else if (name === "stock") {
      setProduit({ ...produit, stock: value === "" ? "" : Number(value) });
    } else {
      setProduit({ ...produit, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation champs obligatoires
    if (!produit.nom || produit.prix === "" || !produit.categorie || produit.stock === "") {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    // Filtrer les images valides
    const filledImages = produit.images.filter((img) => img.trim() !== "");

    // Validation nombre d'images : minimum 1, maximum 5
    if (filledImages.length < 1 || filledImages.length > 5) {
      alert("Veuillez ajouter entre 1 et 5 images !");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...produit,
          prix: Number(produit.prix),
          stock: Number(produit.stock),
          images: filledImages, // envoyer tableau propre
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur API");
      }

      alert("✅ Produit ajouté avec succès !");
      router.push("/admin/produits");
    } catch (err: any) {
      console.error("Erreur lors de l'ajout :", err);
      alert(`❌ Une erreur est survenue : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Ajouter un produit
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-gray-700 mb-1">Nom du produit *</label>
          <input
            type="text"
            name="nom"
            value={produit.nom}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-gray-700 mb-1">Prix (DA) *</label>
          <input
            type="number"
            name="prix"
            value={produit.prix}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-gray-700 mb-1">Catégorie *</label>
          <select
            name="categorie"
            value={produit.categorie}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">-- Choisir une catégorie --</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Enfant">Enfant</option>
            <option value="Lentilles">Lentilles</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-700 mb-1">Stock *</label>
          <input
            type="number"
            name="stock"
            value={produit.stock}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 mb-1">Images (1 à 5 URLs) *</label>
          {Array.from({ length: 5 }).map((_, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`URL Image ${idx + 1}`}
              value={produit.images[idx] || ""}
              onChange={(e) => {
                const newImages = [...produit.images];
                newImages[idx] = e.target.value;
                setProduit({ ...produit, images: newImages });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            />
          ))}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={produit.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/produits")}
            className="px-4 py-2 rounded-lg border"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}