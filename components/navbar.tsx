"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <nav className="bg-[#0E0E0F] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl" />
          <div>
            <h1 className="text-xl font-semibold text-white">OPTIC BADIS</h1>
            <p className="text-sm text-gray-300">VOTRE VISION, NOTRE PASSION</p>
          </div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-6 text-white">

          {/* Homme */}
          <Link
            href="/homme"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition text-white"
          >
            Homme
          </Link>

          {/* Femme */}
          <Link
            href="/femme"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition text-white"
          >
            Femme
          </Link>

          {/* Enfants */}
          <Link
            href="/enfants"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition text-white"
          >
            Enfants
          </Link>

          {/* Lentilles */}
          <Link
            href="/lentilles"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition flex items-center gap-2 text-white"
          >
            Lentilles
          </Link>

          {/* Recherche */}
          <Link
            href="/recherche"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition flex items-center gap-2 text-white"
          >
            <Search size={18} /> Recherche
          </Link>

          {/* Panier */}
          <Link
            href="/panier"
            className="bg-[#111113] px-4 py-2 rounded-xl hover:text-yellow-400 transition flex items-center gap-2 text-white"
          >
            <ShoppingCart size={18} /> Panier
          </Link>
        </div>
      </div>
    </nav>
  );
}