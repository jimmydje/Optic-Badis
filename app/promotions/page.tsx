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
  promotion?: number | null; // 20 | 30 | 35
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
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
      <p className="text-gray-500 mb-6">{pack}</p>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((prod) => (
          <Link
            key={prod.id}
            href={`/promotions/${prod.id}`}
            className="bg-white rounded-xl shadow-xl p-5 cursor-pointer hover:scale-105 transition"
          >
            <div className="w-full h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              {prod.imageUrl ? (
                <Image
                  src={prod.imageUrl}
                  alt={prod.nom}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              ) : (
                <div className="text-gray-400">No Image</div>
              )}
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-800">
              {prod.nom}
            </h3>

            <p className="text-gray-600 text-sm">
              {prod.description ?? "Description non disponible"}
            </p>

            <p className="mt-3 text-blue-600 font-bold text-lg">
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

        // Vérification : si data n'est pas un tableau, on cherche data.promotions
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
    return <p className="p-10 text-center">Chargement...</p>;
  }

  return (
    <div className="p-10 space-y-16 bg-gray-50 min-h-screen">
      <Section title="Promotion -20%" pack="Pack Découverte" products={p20} />
      <Section title="Promotion -30%" pack="Pack Premium" products={p30} />
      <Section title="Promotion -35%" pack="Pack Luxe" products={p35} />

      {p20.length === 0 && p30.length === 0 && p35.length === 0 && (
        <p className="text-center text-gray-500">
          Aucune promotion disponible pour le moment.
        </p>
      )}
    </div>
  );
}
