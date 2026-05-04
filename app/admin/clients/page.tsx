"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  nom: string;
  email: string;
  telephone?: string | null;
  createdAt?: string;
  commandes?: {
    id: string;
    total: number;
    statut: string;
  }[];
};

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients", { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur de chargement clients");
        const data = await res.json();
        setClients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur fetch clients:", err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce client et ses commandes ?")) return;

    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("❌ Erreur suppression client:", err);
      alert("Erreur lors de la suppression du client.");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Chargement...</p>;
  }

  return (
    <div className="text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Clients</h1>

        <button
          onClick={() => router.push("/admin/clients/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Ajouter un client
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        {clients.length === 0 ? (
          <p className="text-center text-gray-500">Aucun client trouvé.</p>
        ) : (
          <table className="w-full border-collapse text-left text-black">
            <thead>
              <tr className="border-b bg-gray-100 text-black">
                <th className="py-2 px-3">Nom</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Téléphone</th>
                <th className="py-2 px-3">Commandes</th>
                <th className="py-2 px-3">Date d’inscription</th>
                <th className="py-2 px-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="text-black">
              {clients.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 px-3 font-medium">
                    {c.nom || "—"}
                  </td>

                  <td className="py-2 px-3">
                    {c.email || "—"}
                  </td>

                  <td className="py-2 px-3">
                    {c.telephone || "—"}
                  </td>

                  <td className="py-2 px-3">
                    {c.commandes?.length || 0}
                  </td>

                  <td className="py-2 px-3">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>

                  <td className="py-2 px-3 text-center space-x-3">
                    <button
                      onClick={() =>
                        router.push(`/admin/clients/${c.id}/edit`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 hover:underline"
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