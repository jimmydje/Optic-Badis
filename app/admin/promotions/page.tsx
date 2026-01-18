"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Promotion {
  id: string;
  nom: string;
  prix: number;
  promotion: number;
  description?: string;
  imageUrl?: string;
}

export default function PromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/promotions");
        if (!res.ok) throw new Error("Erreur lors du chargement");

        const data = await res.json();
        setPromotions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur de chargement des promotions :", err);
        setError("Impossible de charger les promotions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const deletePromotion = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette promotion ?")) return;

    try {
      const res = await fetch("/api/promotions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setPromotions(promotions.filter((p) => p.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error("Erreur de suppression :", err);
      alert("Erreur serveur lors de la suppression");
    }
  };

  const editPromotion = (id: string) => {
    router.push(`/admin/promotions/modifier/${id}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
        <button
          onClick={() => router.push("/admin/promotions/ajouter")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          + Ajouter une promotion
        </button>
      </div>

      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Prix</th>
              <th className="py-2 px-4 text-left">Promo</th>
              <th className="py-2 px-4 text-left">Prix final</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Chargement...
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Aucune promotion trouvée
                </td>
              </tr>
            ) : (
              promotions.map((promo) => {
                const prixFinal = promo.prix - (promo.prix * promo.promotion) / 100;

                return (
                  <tr key={promo.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{promo.nom}</td>
                    <td className="py-2 px-4">{promo.description || "-"}</td>
                    <td className="py-2 px-4">{promo.prix} DA</td>
                    <td className="py-2 px-4">-{promo.promotion}%</td>
                    <td className="py-2 px-4 font-bold">{prixFinal.toFixed(2)} DA</td>
                    <td className="py-2 px-4 text-center space-x-2">
                      <button
                        onClick={() => editPromotion(promo.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deletePromotion(promo.id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
