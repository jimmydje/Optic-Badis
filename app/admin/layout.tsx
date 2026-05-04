"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* 🔥 SIDEBAR */}
      <aside
        className={`
          fixed left-0 w-64 bg-white text-black p-6 shadow-md z-50
          top-16 h-[calc(100vh-4rem)]
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-blue-600">
            Optic Admin
          </h2>

          {/* CLOSE BTN (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-2xl"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="flex flex-col space-y-2">
          <Link href="/admin" className="p-3 rounded hover:bg-blue-100">
            Dashboard
          </Link>
          <Link href="/admin/produits" className="p-3 rounded hover:bg-blue-100">
            Produits
          </Link>
          <Link href="/admin/commandes" className="p-3 rounded hover:bg-blue-100">
            Commandes
          </Link>
          <Link href="/admin/clients" className="p-3 rounded hover:bg-blue-100">
            Clients
          </Link>
          <Link href="/admin/promotions" className="p-3 rounded hover:bg-blue-100">
            Promotions
          </Link>
        </nav>
      </aside>

      {/* 🔥 OVERLAY MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 MAIN */}
      <div className="flex flex-col md:ml-64">

        {/* TOPBAR MOBILE */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>

          <h1 className="font-semibold">Admin</h1>
        </div>

        {/* CONTENT */}
        <main className="p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
} 