"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Promotion {
  id: string;
  nom: string;
  description: string;
  prix: number;
  imageUrl: string;
  promotion: number; // 20, 30 ou 35
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPromo, setNewPromo] = useState<Partial<Promotion>>({ promotion: 20 });

  // Fetch promotions depuis l'API
  const fetchPromotions = async () => {
    try {
      const res = await fetch("/api/promotions");
      const data = await res.json();

      // S'assurer que data est un tableau
      if (Array.isArray(data)) {
        setPromotions(data);
      } else {
        console.warn("L'API ne renvoie pas un tableau :", data);
        setPromotions([]);
      }
    } catch (err) {
      console.error(err);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Ajouter une promotion
  const handleAdd = async () => {
    if (!newPromo.nom || !newPromo.prix || !newPromo.imageUrl) return alert("Remplis tous les champs !");
    try {
      const res = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout");
      setNewPromo({ promotion: 20 });
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer une promotion
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchPromotions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Promotions</h1>

      {/* Formulaire ajout promotion */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Ajouter une promotion</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Nom du produit"
            className="border px-3 py-2 rounded"
            value={newPromo.nom || ""}
            onChange={(e) => setNewPromo({ ...newPromo, nom: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="border px-3 py-2 rounded"
            value={newPromo.description || ""}
            onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Prix"
            className="border px-3 py-2 rounded"
            value={newPromo.prix || ""}
            onChange={(e) => setNewPromo({ ...newPromo, prix: Number(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border px-3 py-2 rounded"
            value={newPromo.imageUrl || ""}
            onChange={(e) => setNewPromo({ ...newPromo, imageUrl: e.target.value })}
          />
          <select
            className="border px-3 py-2 rounded"
            value={newPromo.promotion}
            onChange={(e) => setNewPromo({ ...newPromo, promotion: Number(e.target.value) })}
          >
            <option value={20}>-20%</option>
            <option value={30}>-30%</option>
            <option value={35}>-35%</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Tableau des promotions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Liste des promotions</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : !Array.isArray(promotions) || promotions.length === 0 ? (
          <p>Aucune promotion pour le moment.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Image</th>
                <th className="py-2">Nom</th>
                <th className="py-2">Prix</th>
                <th className="py-2">Promotion</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    <Image src={p.imageUrl} alt={p.nom} width={50} height={50} className="object-contain" />
                  </td>
                  <td className="py-2">{p.nom}</td>
                  <td className="py-2">{p.prix} DA</td>
                  <td className="py-2">-{p.promotion}%</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
