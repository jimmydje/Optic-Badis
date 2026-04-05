"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Search, Menu, X, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from '@/lib/auth/client';
 
// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 🔥 Logout function
  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  // Cacher navbar dans admin
  if (pathname.startsWith("/admin")) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/produits?search=${search}`);
    setSearch("");
    setMobileOpen(false);
  };

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-xl transition cursor-pointer ${
      pathname.startsWith(path)
        ? "text-[#DAAB3A]"
        : "text-white hover:text-[#DAAB3A]"
    }`;

  return (
    <nav className="bg-[#0E0E0F] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#DAAB3A]">OPTIC BADIS</h1>
            <p className="text-xs text-gray-400">VOTRE VISION, NOTRE PASSION</p>
          </div>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">

          {/* Lunettes de vue */}
          <div className="relative group">
            <span className={linkClass("/lunettes-de-vue")}>Lunettes de vue</span>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
              <div className="bg-[#0E0E0F] text-white w-60 p-4 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2">Catégories</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/homme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Lunettes de vue homme</Link>
                  </li>
                  <li>
                    <Link href="/femme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Lunettes de vue femme</Link>
                  </li>
                  <li>
                    <Link href="/enfants" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Lunettes de vue enfant</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lunettes de soleil */}
          <div className="relative group">
            <span className={linkClass("/lunettes-de-soleil")}>Lunettes de soleil</span>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
              <div className="bg-[#0E0E0F] text-white w-60 p-4 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2">Catégories</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <span className="block px-2 py-1 rounded hover:text-[#DAAB3A] cursor-pointer">Homme</span>
                  </li>
                  <li>
                    <span className="block px-2 py-1 rounded hover:text-[#DAAB3A] cursor-pointer">Femme</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lentilles */}
          <Link href="/lentilles" className={linkClass("/lentilles")}>Lentilles</Link>

          {/* Recherche */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm">
            <input
              type="text"
              placeholder="Recherche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-32 text-black"
            />
            <button type="submit">
              <Search size={18} className="text-black hover:text-[#DAAB3A]" />
            </button>
          </form>

          {/* Panier */}
          <Link href="/panier" className={`flex items-center gap-2 ${linkClass("/panier")}`}>
            <ShoppingCart size={18} />
            Panier
          </Link>

          {/* Auth */}
          {session?.user ? (
            <div className="flex items-center gap-3">

              <span className="px-4 py-2 rounded-xl bg-[#DAAB3A] text-black font-medium">
                {session.user.name}
              </span>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
                title="Se déconnecter"
              >
                <LogOut size={18} className="text-white" />
              </button>

            </div>
          ) : (
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 rounded-xl bg-[#DAAB3A] text-black font-medium hover:bg-[#c99a2e]"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile button */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-[#111113] p-4 rounded-xl">
          <span className="font-medium text-white">Lunettes de vue</span>
          <Link href="/homme" onClick={()=>setMobileOpen(false)} className="px-4 py-2 text-white hover:text-[#DAAB3A]">Homme</Link>
          <Link href="/femme" onClick={()=>setMobileOpen(false)} className="px-4 py-2 text-white hover:text-[#DAAB3A]">Femme</Link>
          <Link href="/enfants" onClick={()=>setMobileOpen(false)} className="px-4 py-2 text-white hover:text-[#DAAB3A]">Enfants</Link>

          <span className="font-medium text-white mt-2">Lunettes de soleil</span>
          <span className="px-4 py-2 text-white cursor-pointer hover:text-[#DAAB3A]">Homme</span>
          <span className="px-4 py-2 text-white cursor-pointer hover:text-[#DAAB3A]">Femme</span>

          <Link href="/lentilles" onClick={()=>setMobileOpen(false)} className="px-4 py-2 text-white hover:text-[#DAAB3A]">Lentilles</Link>
          <Link href="/panier" onClick={()=>setMobileOpen(false)} className="px-4 py-2 text-white hover:text-[#DAAB3A]">Panier</Link>
        </div>
      )}
    </nav>
  );
}