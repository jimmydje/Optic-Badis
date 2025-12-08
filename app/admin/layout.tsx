import { ReactNode } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white text-black p-6 shadow-md hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Optic Admin</h2>

        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="p-3 rounded hover:bg-blue-100">Dashboard</Link>
          <Link href="/admin/produits" className="p-3 rounded hover:bg-blue-100">Produits</Link>
          <Link href="/admin/commandes" className="p-3 rounded hover:bg-blue-100">Commandes</Link>
          <Link href="/admin/clients" className="p-3 rounded hover:bg-blue-100">Clients</Link>
          <Link href="/admin/promotions" className="p-3 rounded hover:bg-blue-100">Promotions</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
