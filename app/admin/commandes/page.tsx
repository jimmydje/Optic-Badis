"use client";

import { useEffect, useState } from "react";

interface ProduitCommande {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  image?: string;
}

interface Commande {
  id: string;
  client: { nom: string } | null;
  clientId: string;
  produits: ProduitCommande[];
  total: number;
  statut: "En attente" | "En cours" | "Livrée" | "Annulée";
  date: string;
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await fetch("/api/commandes");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCommandes(data);
        } else {
          setCommandes([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        setCommandes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const handleChangeStatut = async (
    id: string,
    newStatut: Commande["statut"]
  ) => {
    setUpdating(id);
    try {
      const res = await fetch("/api/commandes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut: newStatut }),
      });

      if (!res.ok) throw new Error();

      setCommandes((prev) =>
        prev.map((cmd) =>
          cmd.id === id ? { ...cmd, statut: newStatut } : cmd
        )
      );
    } catch (error) {
      console.error(error);
      alert("Impossible de mettre à jour le statut.");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Supprimer cette commande ?");

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/commandes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error();

      setCommandes((prev) => prev.filter((cmd) => cmd.id !== id));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Chargement...
      </p>
    );
  }

  return (
    <div className="text-black">
      <h1 className="text-2xl font-semibold mb-6">Commandes</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        {commandes.length === 0 ? (
          <p className="text-gray-500 text-center">
            Aucune commande pour le moment.
          </p>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 px-3">Client</th>
                <th className="py-2 px-3">Produits</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Montant</th>
                <th className="py-2 px-3">Statut</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {commandes.map((cmd) => (
                <tr
                  key={cmd.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Client */}
                  <td className="py-2 px-3">
                    {cmd.client?.nom || "—"}
                  </td>

                  {/* Produits */}
                  <td className="py-2 px-3">
                    {cmd.produits.length > 0 ? (
                      cmd.produits.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 mb-2"
                        >
                          {p.image && (
                            <img
                              src={p.image}
                              alt={p.nom}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}

                          <div>
                            <div className="font-medium">
                              {p.nom}
                            </div>
                            <div className="text-sm text-gray-500">
                              {p.quantite} × {p.prix} DA ={" "}
                              <span className="font-semibold text-black">
                                {p.quantite * p.prix} DA
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400">
                        Aucun produit
                      </span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-2 px-3">
                    {cmd.date
                      ? new Date(cmd.date).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>

                  {/* Total */}
                  <td className="py-2 px-3 font-semibold">
                    {cmd.total?.toLocaleString()} DA
                  </td>

                  {/* Statut */}
                  <td className="py-2 px-3">
                    <select
                      value={cmd.statut}
                      onChange={(e) =>
                        handleChangeStatut(
                          cmd.id,
                          e.target.value as Commande["statut"]
                        )
                      }
                      disabled={updating === cmd.id}
                      className={`rounded-lg px-2 py-1 border outline-none ${
                        cmd.statut === "Livrée"
                          ? "bg-green-100 text-green-700"
                          : cmd.statut === "Annulée"
                          ? "bg-red-100 text-red-700"
                          : cmd.statut === "En cours"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="py-2 px-3">
                    <button
                      onClick={() => handleDelete(cmd.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
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