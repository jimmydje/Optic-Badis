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

  const fetchPromotions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/promotions", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.promotions)
        ? data.promotions
        : [];

      setPromotions(list);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les promotions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

      if (!res.ok) throw new Error();

      await fetchPromotions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const editPromotion = (id: string) => {
    router.push(`/admin/promotions/modifier/${id}`);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 text-gray-900">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Promotions
        </h1>

        <button
          onClick={() => router.push("/admin/promotions/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
        >
          + Ajouter une promotion
        </button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-medium">{error}</div>
      )}

      {/* CONTENT */}
      <div className="bg-white rounded-lg shadow p-4 md:p-6">

        {/* ✅ TABLE DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Prix</th>
                <th className="py-3 px-4 text-left">Promo</th>
                <th className="py-3 px-4 text-left">Prix final</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-6">
                    Chargement...
                  </td>
                </tr>
              ) : promotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Aucune promotion trouvée
                  </td>
                </tr>
              ) : (
                promotions.map((promo) => {
                  const promoValue = Number(promo.promotion) || 0;
                  const prixFinal =
                    promo.prix - (promo.prix * promoValue) / 100;

                  return (
                    <tr key={promo.id} className="border-t hover:bg-gray-100">
                      <td className="py-3 px-4 font-medium">{promo.nom}</td>
                      <td className="py-3 px-4">{promo.description || "-"}</td>
                      <td className="py-3 px-4">{promo.prix} DA</td>
                      <td className="py-3 px-4 text-red-600 font-semibold">
                        -{promoValue}%
                      </td>
                      <td className="py-3 px-4 font-bold text-green-600">
                        {prixFinal.toFixed(2)} DA
                      </td>
                      <td className="py-3 px-4 text-center space-x-3">
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

        {/* ✅ CARDS MOBILE */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <p className="text-center py-6">Chargement...</p>
          ) : promotions.length === 0 ? (
            <p className="text-center text-gray-500">
              Aucune promotion trouvée
            </p>
          ) : (
            promotions.map((promo) => {
              const promoValue = Number(promo.promotion) || 0;
              const prixFinal =
                promo.prix - (promo.prix * promoValue) / 100;

              return (
                <div
                  key={promo.id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <p className="font-semibold text-lg">{promo.nom}</p>
                  <p className="text-sm text-gray-600">
                    {promo.description || "-"}
                  </p>

                  <div className="mt-2 text-sm space-y-1">
                    <p><span className="font-medium">Prix :</span> {promo.prix} DA</p>
                    <p className="text-red-600">
                      <span className="font-medium">Promo :</span> -{promoValue}%
                    </p>
                    <p className="text-green-600 font-bold">
                      Prix final : {prixFinal.toFixed(2)} DA
                    </p>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => editPromotion(promo.id)}
                      className="text-blue-600 text-sm"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => deletePromotion(promo.id)}
                      className="text-red-600 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
} 