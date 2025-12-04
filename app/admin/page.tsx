"use client";

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ----- MAIN CONTENT ----- */}
      <main className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Tableau de bord
        </h1>

        
       {/* Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h2 className="text-gray-500">Produits</h2>
    <p className="text-3xl font-bold text-blue-600 mt-2">128</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h2 className="text-gray-500">Commandes</h2>
    <p className="text-3xl font-bold text-green-600 mt-2">64</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h2 className="text-gray-500">Clients</h2>
    <p className="text-3xl font-bold text-purple-600 mt-2">35</p>
  </div>

  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h2 className="text-gray-500">Promotions</h2>
    <p className="text-3xl font-bold text-red-600 mt-2">12</p>
  </div>
</div>

        {/* Table */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Dernières commandes
          </h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Client</th>
                <th className="py-2">Date</th>
                <th className="py-2">Montant</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Ahmed B.</td>
                <td className="py-2">29 Oct 2025</td>
                <td className="py-2">12000 DA</td>
                <td className="py-2 text-green-600 font-medium">Livrée</td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Sarah K.</td>
                <td className="py-2">28 Oct 2025</td>
                <td className="py-2">9500 DA</td>
                <td className="py-2 text-yellow-600 font-medium">En cours</td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-2">Rami D.</td>
                <td className="py-2">27 Oct 2025</td>
                <td className="py-2">7000 DA</td>
                <td className="py-2 text-red-600 font-medium">Annulée</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}
