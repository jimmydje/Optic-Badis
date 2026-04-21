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

// 🔹 SECTION REUTILISABLE
function Section({
  title,
  pack,
  products,
}: {
  title: string;
  pack: string;
  products: Product[];
}) {
  if (products.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* TITRE */}
      <h2 className="text-2xl md:text-3xl font-semibold text-[#212E53] mb-2">
        {title}
      </h2>
      <p className="text-neutral-500 mb-8">{pack}</p>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((prod) => (
          <Link
            key={prod.id}
            href={`/promotions/${prod.id}`}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer"
          >
            {/* IMAGE */}
            <div className="relative h-56 w-full bg-neutral-100">
              {prod.imageUrl ? (
                <Image
                  src={prod.imageUrl}
                  alt={prod.nom}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  No Image
                </div>
              )}

              {/* BADGE PROMO */}
              <span className="absolute top-3 left-3 bg-[#212E53] text-white text-xs px-3 py-1 rounded-full">
                -{prod.promotion}%
              </span>
            </div>

            {/* INFOS */}
            <div className="p-6">
              <h3 className="text-lg font-medium text-black group-hover:underline">
                {prod.nom}
              </h3>

              <p className="text-sm text-neutral-500 mt-1">
                {prod.description ?? "Description non disponible"}
              </p>

              <p className="mt-4 text-xl font-semibold text-[#212E53]">
                {prod.prix} DA
              </p>

             <Link
  href={`/promotions/${prod.id}`}
  className="block text-center w-full mt-4 py-3 rounded-full bg-[#212E53] text-white hover:opacity-90 transition"
>
  Voir l’offre
</Link>  
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 🔹 PAGE PRINCIPALE
export default function PromotionsPage() {
  const [p20, setP20] = useState<Product[]>([]);
  const [p30, setP30] = useState<Product[]>([]);
  const [p35, setP35] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("/api/promotions");
        const data = await res.json();

        const promotions = Array.isArray(data)
          ? data
          : Array.isArray(data.promotions)
          ? data.promotions
          : [];

        setP20(promotions.filter((p: Product) => p.promotion === 20));
        setP30(promotions.filter((p: Product) => p.promotion === 30));
        setP35(promotions.filter((p: Product) => p.promotion === 35));
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

  return (
    <div className="min-h-screen bg-neutral-100 py-20 px-6 space-y-20">

      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-semibold text-[#212E53] mb-6">
          Nos Promotions
        </h1>
        <p className="text-neutral-600">
          Profitez de nos offres exclusives sur une sélection de lunettes et lentilles.
        </p>
      </div>

      {/* SECTIONS */}
      <Section title="Promotion -20%" pack="Pack Découverte" products={p20} />
      <Section title="Promotion -30%" pack="Pack Premium" products={p30} />
      <Section title="Promotion -35%" pack="Pack Luxe" products={p35} />

      {/* EMPTY */}
      {p20.length === 0 && p30.length === 0 && p35.length === 0 && (
        <p className="text-center text-neutral-500">
          Aucune promotion disponible pour le moment.
        </p>
      )}

    </div>
  );
}  