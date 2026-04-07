"use client";

import { useEffect, useState } from "react";

interface Commande {
  id: string;
  client: { nom: string } | null;
  clientId: string;
  produits: { id: string; nom: string; prix: number; quantite: number }[];
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

        // ✅ sécurisation (évite crash map)
        if (Array.isArray(data)) {
          setCommandes(data);
        } else {
          console.error("Réponse invalide API :", data);
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
        {!Array.isArray(commandes) || commandes.length === 0 ? (
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
                    {cmd.produits?.length > 0 ? (
                      cmd.produits.map((p, i) => (
                        <div key={i}>
                          {p.nom} x{p.quantite}
                        </div>
                      ))
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-2 px-3">
                    {cmd.date
                      ? new Date(cmd.date).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>

                  {/* Total */}
                  <td className="py-2 px-3">
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
                      className={`rounded-lg px-2 py-1 border ${
                        cmd.statut === "Livrée"
                          ? "bg-green-100 text-green-700"
                          : cmd.statut === "Annulée"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Livrée">Livrée</option>
                      <option value="Annulée">Annulée</option>
                    </select>
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