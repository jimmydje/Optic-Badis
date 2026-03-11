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
  if (products.length === 0) return null;

  return (
    <div className="bg-[#111113] p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-[#DAAB3A]">{title}</h2>
      <p className="text-gray-400 mb-6">{pack}</p>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((prod) => (
          <Link
            key={prod.id}
            href={`/promotions/${prod.id}`}
            className="bg-[#1a1a1c] rounded-xl shadow-xl p-5 cursor-pointer hover:scale-105 transition"
          >
            <div className="w-full h-56 bg-black rounded-lg flex items-center justify-center">
              {prod.imageUrl ? (
                <Image
                  src={prod.imageUrl}
                  alt={prod.nom}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              ) : (
                <div className="text-gray-500">No Image</div>
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {prod.nom}
            </h3>

            <p className="text-gray-400 text-sm">
              {prod.description ?? "Description non disponible"}
            </p>

            <p className="mt-3 text-[#DAAB3A] font-bold text-lg">
              {prod.prix} DA
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
    return <p className="p-10 text-center text-white">Chargement...</p>;
  }

  return (
    <div className="p-10 space-y-16 bg-black min-h-screen">
      <Section title="Promotion -20%" pack="Pack Découverte" products={p20} />
      <Section title="Promotion -30%" pack="Pack Premium" products={p30} />
      <Section title="Promotion -35%" pack="Pack Luxe" products={p35} />

      {p20.length === 0 && p30.length === 0 && p35.length === 0 && (
        <p className="text-center text-gray-400">
          Aucune promotion disponible pour le moment.
        </p>
      )}
    </div>
  );
}