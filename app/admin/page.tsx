import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.getSession();

  if (!session?.data?.user) {
    redirect("/auth/sign-in");
  }

  if ((session.data.user as any).role?.toLowerCase() !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8 py-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Tableau de bord
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenue dans votre espace administrateur
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Produits</p>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">
            128
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Commandes</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
            64
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Clients</p>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-2">
            35
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Promotions</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-2">
            12
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* TITLE */}
        <div className="p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-black">
            Dernières commandes
          </h2>
        </div>

        {/* TABLE RESPONSIVE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">

            <thead className="text-sm sm:text-base border-b bg-gray-50">
              <tr>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>

            <tbody className="text-sm sm:text-base text-black">

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Ahmed B.</td>
                <td className="py-3 px-4">29 Oct 2025</td>
                <td className="py-3 px-4">12000 DA</td>
                <td className="py-3 px-4 text-green-600 font-medium">
                  Livrée
                </td>
              </tr>

              <tr className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">Sarah K.</td>
                <td className="py-3 px-4">28 Oct 2025</td>
                <td className="py-3 px-4">9500 DA</td>
                <td className="py-3 px-4 text-yellow-600 font-medium">
                  En cours
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4">Rami D.</td>
                <td className="py-3 px-4">27 Oct 2025</td>
                <td className="py-3 px-4">7000 DA</td>
                <td className="py-3 px-4 text-red-600 font-medium">
                  Annulée
                </td>
              </tr>

            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
} 