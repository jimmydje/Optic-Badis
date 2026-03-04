"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/produits?search=${search}`);
    setSearch("");
    setMobileOpen(false);
  };

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-xl transition duration-300 ${
      pathname === path
        ? "text-[#DAAB3A] bg-[#1a1a1c]"
        : "text-white hover:text-[#DAAB3A]"
    }`;

  return (
    <nav className="bg-[#0E0E0F] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#DAAB3A]">
              OPTIC BADIS
            </h1>
            <p className="text-xs text-gray-400">
              VOTRE VISION, NOTRE PASSION
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">

          <Link href="/homme" className={linkClass("/homme")}>
            Homme
          </Link>

          <Link href="/femme" className={linkClass("/femme")}>
            Femme
          </Link>

          <Link href="/enfants" className={linkClass("/enfants")}>
            Enfants
          </Link>

          <Link href="/lentilles" className={linkClass("/lentilles")}>
            Lentilles
          </Link>

          {/* Barre de recherche blanche */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm"
          >
            <input
              type="text"
              placeholder="Recherche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 text-black placeholder-gray-500"
            />
            <button type="submit">
              <Search
                size={18}
                className="text-black hover:text-[#DAAB3A] transition"
              />
            </button>
          </form>

          {/* Panier */}
          <Link
            href="/panier"
            className={`flex items-center gap-2 ${linkClass("/panier")}`}
          >
            <ShoppingCart size={18} className="text-white" />
            Panier
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-[#111113] p-4 rounded-xl">

          <Link
            href="/homme"
            onClick={() => setMobileOpen(false)}
            className={linkClass("/homme")}
          >
            Homme
          </Link>

          <Link
            href="/femme"
            onClick={() => setMobileOpen(false)}
            className={linkClass("/femme")}
          >
            Femme
          </Link>

          <Link
            href="/enfants"
            onClick={() => setMobileOpen(false)}
            className={linkClass("/enfants")}
          >
            Enfants
          </Link>

          <Link
            href="/lentilles"
            onClick={() => setMobileOpen(false)}
            className={linkClass("/lentilles")}
          >
            Lentilles
          </Link>

          {/* Panier mobile */}
          <Link
            href="/panier"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2 ${linkClass("/panier")}`}
          >
            <ShoppingCart size={18} className="text-white" />
            Panier
          </Link>
        </div>
      )}
    </nav>
  );
}