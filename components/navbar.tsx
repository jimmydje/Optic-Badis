"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function Navbar() {
  const { data: session } = authClient.useSession();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openMenu, setOpenMenu] = useState<string | null>(null); // desktop
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null); // mobile

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileOpen(false);
  };

  // Desktop hover menu
  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 250);
  };

  // Mobile accordion
  const toggleMobileMenu = (menu: string) => {
    setMobileMenuOpen(mobileMenuOpen === menu ? null : menu);
  };

  const linkClass = (path: string) =>
    `text-sm font-medium ${
      pathname?.startsWith(path)
        ? "text-[#212E53]"
        : "text-gray-600 hover:text-[#212E53]"
    }`;

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  return (
    <nav className="bg-white text-black px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LEFT DESKTOP */}
        <div className="hidden md:flex items-center gap-8">

          {/* SOLAIRE */}
          <div
            onMouseEnter={() => handleMouseEnter("solaire")}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <span className="cursor-pointer text-sm text-gray-600 hover:text-[#212E53]">
              LUNETTES SOLAIRES
            </span>

            {openMenu === "solaire" && (
              <div className="absolute top-full mt-3 w-56 bg-white border shadow-lg rounded-xl p-4 animate-fadeIn">
                <Link href="/solaire/hommes" className="block py-2 hover:text-[#212E53]">
                  HOMME
                </Link>
                <Link href="/solaire/femmes" className="block py-2 hover:text-[#212E53]">
                  FEMME
                </Link>
              </div>
            )}
          </div>

          {/* OPTIQUE */}
          <div
            onMouseEnter={() => handleMouseEnter("optique")}
            onMouseLeave={handleMouseLeave}
            className="relative"
          >
            <span className="cursor-pointer text-sm text-gray-600 hover:text-[#212E53]">
              LUNETTES OPTIQUES
            </span>

            {openMenu === "optique" && (
              <div className="absolute top-full mt-3 w-56 bg-white border shadow-lg rounded-xl p-4 animate-fadeIn">
                <Link href="/homme" className="block py-2 hover:text-[#212E53]">
                  HOMME
                </Link>
                <Link href="/femme" className="block py-2 hover:text-[#212E53]">
                  FEMME
                </Link>
                <Link href="/enfants" className="block py-2 hover:text-[#212E53]">
                  ENFANTS
                </Link>
              </div>
            )}
          </div>

          <Link href="/lentilles" className={linkClass("/lentilles")}>
            LENTILLES
          </Link>
        </div>

        {/* LOGO */}
        <Link href="/" className="text-lg font-semibold tracking-widest">
          OPTIC BADIS
        </Link>

        {/* RIGHT DESKTOP */}
        <div className="hidden md:flex items-center gap-6">

          <form onSubmit={handleSearch} className="flex items-center gap-2 border-b">
            <input
              type="text"
              placeholder="Recherche"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm px-2 py-1"
            />
            <button type="submit">
              <Search size={18} />
            </button>
          </form>

          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{session.user.name}</span>

              {session.user.role?.toLowerCase() === "admin" && (
                <Link href="/admin" className="text-sm font-semibold text-[#212E53]">
                  Admin
                </Link>
              )}

              <button onClick={handleLogout}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link href="/auth/sign-in">
              <User size={20} />
            </Link>
          )}

          <Link href="/panier">
            <ShoppingCart size={20} />
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button className="md:hidden" onClick={() => setMobileOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-[75%] bg-white shadow-lg z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Menu</h2>
            <button onClick={() => setMobileOpen(false)}>
              <X />
            </button>
          </div>

          {/* SOLAIRE MOBILE */}
          <div>
            <button
              onClick={() => toggleMobileMenu("solaire")}
              className="w-full text-left font-medium"
            >
              LUNETTES SOLAIRES
            </button>

            {mobileMenuOpen === "solaire" && (
              <div className="pl-4 mt-2 flex flex-col gap-2 text-sm text-gray-600">
                <Link href="/solaire/hommes" onClick={() => setMobileOpen(false)}>
                  HOMME
                </Link>
                <Link href="/solaire/femmes" onClick={() => setMobileOpen(false)}>
                  FEMME
                </Link>
              </div>
            )}
          </div>

          {/* OPTIQUE MOBILE */}
          <div>
            <button
              onClick={() => toggleMobileMenu("optique")}
              className="w-full text-left font-medium"
            >
              LUNETTES OPTIQUES
            </button>

            {mobileMenuOpen === "optique" && (
              <div className="pl-4 mt-2 flex flex-col gap-2 text-sm text-gray-600">
                <Link href="/homme" onClick={() => setMobileOpen(false)}>
                  HOMME
                </Link>
                <Link href="/femme" onClick={() => setMobileOpen(false)}>
                  FEMME
                </Link>
                <Link href="/enfants" onClick={() => setMobileOpen(false)}>
                  ENFANTS
                </Link>
              </div>
            )}
          </div>

          <Link href="/lentilles" onClick={() => setMobileOpen(false)}>
            LENTILLES
          </Link>

          {/* SEARCH */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Recherche"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border px-2 py-1 w-full"
            />
            <button type="submit">
              <Search size={18} />
            </button>
          </form>

          <Link href="/panier" onClick={() => setMobileOpen(false)}>
            Panier
          </Link>

          {session?.user ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link href="/auth/sign-in">Sign in</Link>
          )}
        </div>
      </div>

      {/* BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </nav>
  );
}  










/*"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, Menu, X, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState<{ [key: string]: boolean }>({});

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
    setMobileOpen(false);
  };

  const toggleSubmenu = (key: string) => {
    setSubmenuOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-xl transition cursor-pointer ${
      pathname?.startsWith(path)
        ? "text-[#DAAB3A]"
        : "text-white hover:text-[#DAAB3A]"
    }`;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="bg-[#0E0E0F] text-white px-6 py-4 shadow-md relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo 
        <Link href="/" className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#DAAB3A]">OPTIC BADIS</h1>
            <p className="text-xs text-gray-400">VOTRE VISION, NOTRE PASSION</p>
          </div>
        </Link>
  {/* Desktop menu 
        <div className="hidden md:flex items-center gap-4">

          {/* Lunettes de vue 
          <div className="relative group">
            <span className={linkClass("/lunettes-de-vue")}>Lunettes de vue</span>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
              <div className="bg-[#0E0E0F] text-white w-60 p-4 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2">Catégories</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/homme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Homme</Link>
                  </li>
                  <li>
                    <Link href="/femme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Femme</Link>
                  </li>
                  <li>
                    <Link href="/enfants" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Enfants</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lunettes de soleil 
          <div className="relative group">
            <span className={linkClass("/lunettes-de-soleil")}>Lunettes de soleil</span>
            <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50">
              <div className="bg-[#0E0E0F] text-white w-60 p-4 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-2">Catégories</h3>
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link href="/solaire.homme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Homme</Link>
                  </li>
                  <li>
                    <Link href="/solaire.femme" className="block px-2 py-1 rounded hover:text-[#DAAB3A]">Femme</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Lentilles 
          <Link href="/lentilles" className={linkClass("/lentilles")}>Lentilles</Link>

          {/* Recherche desktop 
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


         

          {/* Panier 
          <Link href="/panier" className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Panier
          </Link>

          {/* Auth 
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-[#DAAB3A] text-black">
                {session.user.name}
              </span>

              {/* Lien admin si admin 
              {session.user.role?.toLowerCase() === "admin" && (
                <Link href="/admin" className="text-[#DAAB3A] font-semibold">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-500 hover:bg-red-600"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 rounded-xl bg-[#DAAB3A] text-black"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile button 
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </nav>
  );
} 
  */