"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-50 text-black px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">Optic Badis</Link>
        </div>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/homme" className="hover:text-blue-600">Homme</Link>
          <Link href="/femme" className="hover:text-blue-600">Femme</Link>
          <Link href="/enfants" className="hover:text-blue-600">Enfants</Link>
          <Link href="/nouveautes" className="hover:text-blue-600">Nouveautes</Link>
        </div>

        {/* Panier */}
        <div className="flex items-center gap-4">
          <Link href="/panier" className="hover:text-blue-600 flex items-center gap-1">
            <ShoppingCart size={20} /> Panier
          </Link>

          {/* Hamburger Mobile */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="flex flex-col mt-4 md:hidden gap-3">
          <Link href="/homme" className="hover:text-blue-600">Homme</Link>
          <Link href="/femme" className="hover:text-blue-600">Femme</Link>
          <Link href="/enfants" className="hover:text-blue-600">Enfants</Link>
          <Link href="/nouveautes" className="hover:text-blue-600">Nouveautes</Link>
        </div>
      )}
    </nav>
  );
}
