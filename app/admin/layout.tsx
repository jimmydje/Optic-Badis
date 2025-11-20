"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ⚠️ Ici, tu pourrais vérifier le token via cookie JWT
async function checkAuth() {
  try {
    const res = await fetch("/api/admin/check", { cache: "no-store" });
    if (!res.ok) throw new Error("Non autorisé");
    return true;
  } catch {
    return false;
  }
}

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/clients", label: "Clients" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth().then(setAuthorized);
  }, []);

  if (authorized === null) return <p>Chargement...</p>;
  if (!authorized) return <p>⛔ Accès refusé. Veuillez vous connecter.</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white text-black p-6 shadow-md hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-blue-600">Optic Admin</h2>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`p-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-500 text-white font-semibold shadow"
                    : "hover:bg-blue-100 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
