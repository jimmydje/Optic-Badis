"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  imageUrl?: string | null;
  promotion?: number | null;
}

function Section({
  title,
  pack,
  products,
}: {
  title: string;
  pack: string;
  products: Product[];
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0">
      {/* TITLE */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#212E53] mb-2 text-center sm:text-left">
        {title}
      </h2>

      <p className="text-neutral-500 mb-6 sm:mb-8 text-center sm:text-left text-sm sm:text-base">
        {pack}
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

        {products.map((prod) => (
          <Link
            key={prod.id}
            href={`/promotions/${prod.id}`}
            className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition block"
          >
            {/* IMAGE */}
            <div className="relative h-44 sm:h-52 md:h-56 w-full bg-neutral-100">
              {prod.imageUrl ? (
                <Image
                  src={prod.imageUrl}
                  alt={prod.nom}
                  fill
                  className="object-contain p-3 sm:p-4 group-hover:scale-105 transition"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400 text-sm">
                  No Image
                </div>
              )}

              {/* BADGE */}
              <span className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#212E53] text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full">
                -{Number(prod.promotion) || 0}%
              </span>
            </div>

            {/* INFOS */}
            <div className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-black">
                {prod.nom}
              </h3>

              <p className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-2">
                {prod.description ?? "Description non disponible"}
              </p>

              <p className="mt-3 sm:mt-4 text-lg sm:text-xl font-semibold text-[#212E53]">
                {prod.prix} DA
              </p>

              {/* BOUTON (VISUEL UNIQUEMENT) */}
              <div className="mt-3 sm:mt-4">
                <span className="block text-center w-full py-2 sm:py-3 rounded-full bg-[#212E53] text-white text-sm sm:text-base group-hover:opacity-90 transition">
                  Voir l’offre
                </span>
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}

export default function PromotionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions", {
          cache: "no-store",
        });

        const data = await res.json();
        const list: Product[] = data?.promotions ?? [];

        setProducts(list);
      } catch (err) {
        console.error("Erreur chargement promotions :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <p className="p-10 text-center text-neutral-500">
        Chargement...
      </p>
    );
  }

  const p20 = products.filter((p) => Number(p.promotion) === 20);
  const p30 = products.filter((p) => Number(p.promotion) === 30);
  const p35 = products.filter((p) => Number(p.promotion) === 35);

  return (
    <div className="min-h-screen bg-neutral-100 py-10 sm:py-16 lg:py-20 px-4 sm:px-6 space-y-16 sm:space-y-20">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto px-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#212E53] mb-4 sm:mb-6">
          Nos Promotions
        </h1>

        <p className="text-sm sm:text-base text-neutral-600">
          Profitez de nos offres exclusives sur une sélection de lunettes et lentilles.
        </p>
      </div>

      {/* SECTIONS */}
      <Section title="Promotion -20%" pack="Pack Découverte" products={p20} />
      <Section title="Promotion -30%" pack="Pack Premium" products={p30} />
      <Section title="Promotion -35%" pack="Pack Luxe" products={p35} />

      {products.length === 0 && (
        <p className="text-center text-neutral-500 text-sm sm:text-base">
          Aucune promotion disponible pour le moment.
        </p>
      )}
    </div>
  );
}  