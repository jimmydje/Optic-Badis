"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PromotionForm {
  nom: string;
  description: string;
  prix: number | "";
  promotion: number | "";
  imageUrl: string;
}

export default function AjouterPromotionPage() {
  const router = useRouter();

  const [promo, setPromo] = useState<PromotionForm>({
    nom: "",
    description: "",
    prix: "",
    promotion: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "prix" || name === "promotion") {
      setPromo({ ...promo, [name]: value === "" ? "" : Number(value) });
    } else {
      setPromo({ ...promo, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promo.nom || promo.prix === "" || promo.promotion === "") {
      alert("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...promo,
          prix: Number(promo.prix),
          promotion: Number(promo.promotion),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erreur API");
      }

      alert("✅ Promotion ajoutée avec succès !");
      router.push("/admin/promotions");
    } catch (err: any) {
      console.error(err);
      alert(`❌ Une erreur est survenue : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">
        Ajouter une promotion
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nom */}
        <div>
          <label className="block mb-1">Nom du produit *</label>
          <input
            type="text"
            name="nom"
            value={promo.nom}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block mb-1">Prix (DA) *</label>
          <input
            type="number"
            name="prix"
            value={promo.prix}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Promotion */}
        <div>
          <label className="block mb-1">Promotion (%) *</label>
          <input
            type="number"
            name="promotion"
            value={promo.promotion}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1">Image (URL)</label>
          <input
            type="text"
            name="imageUrl"
            value={promo.imageUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={promo.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-black bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push("/admin/promotions")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-black bg-white"
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