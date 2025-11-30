"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProduitForm {
  nom: string;
  description: string;
  prix: number | "";
  categorie: string;
  imageUrl: string;
  stock: number | "";
}

export default function AjouterProduitPage() {
  const router = useRouter();

  const [produit, setProduit] = useState<ProduitForm>({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    imageUrl: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  // Gestion des changements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "prix") setProduit({ ...produit, prix: value === "" ? "" : parseFloat(value) });
    else if (name === "stock") setProduit({ ...produit, stock: value === "" ? "" : parseInt(value) });
    else setProduit({ ...produit, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produit.nom || produit.prix === "" || !produit.categorie || produit.stock === "") {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...produit,
        prix: Number(produit.prix),
        stock: Number(produit.stock),
      };

      const res = await fetch("/api/produits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un produit</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-gray-700 mb-1">Nom du produit *</label>
          <input
            type="text"
            name="nom"
            value={produit.nom}
            onChange={handleChange}
            placeholder="Ex : Lunettes Ray-Ban"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-gray-700 mb-1">Prix (DZD) *</label>
          <input
            type="number"
            name="prix"
            value={produit.prix}
            onChange={handleChange}
            placeholder="Ex : 49.99"
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          >
            <option value="">-- Choisir une catégorie --</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Enfant">Enfant</option>
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
            placeholder="Ex : 10"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-gray-700 mb-1">Image (URL)</label>
          <input
            type="text"
            name="imageUrl"
            value={produit.imageUrl}
            onChange={handleChange}
            placeholder="Ex : https://example.com/lunettes.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={produit.description}
            onChange={handleChange}
            rows={4}
            placeholder="Décris brièvement le produit..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 resize-none"
          ></textarea>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/produits")}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
