"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<null | { role: string }>(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/me"); // nouvelle route pour vérifier login
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <nav className="bg-blue-50 text-black px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link href="/">Optic Badis</Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/homme" className="hover:text-blue-600">Homme</Link>
          <Link href="/femme" className="hover:text-blue-600">Femme</Link>
          <Link href="/enfants" className="hover:text-blue-600">Enfants</Link>
          <Link href="/nouveautes" className="hover:text-blue-600">Nouveautes</Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="font-semibold text-blue-700 hover:text-blue-900">
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/panier" className="hover:text-blue-600 flex items-center gap-1">
            <ShoppingCart size={20} /> Panier
          </Link>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
