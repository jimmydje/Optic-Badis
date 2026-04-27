"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

interface Product {
  id: string;
  nom: string;
  description?: string;
  images: string[];
  prix?: number;
}

export default function ProduitDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/produits/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Chargement...</p>;
  if (!product) return <p className="p-6 text-center">Produit introuvable</p>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* IMAGE */}
        <div className="flex items-center justify-center p-12 bg-white">
          <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gray-50">
            <Image
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/images/default.jpg"
              }
              alt={product.nom}
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* INFOS */}
        <div className="bg-[#212E53] text-white p-12 flex flex-col justify-center">

          <h1 className="text-4xl font-bold uppercase mb-4">
            {product.nom}
          </h1>

          {/* ⭐⭐⭐⭐⭐ */}
          <div className="flex items-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#facc15" stroke="#facc15" />
            ))}
            <span className="text-white/80 text-sm">
              (464 Clients Satisfaits)
            </span>
          </div>

          {/* PRIX */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-3xl font-bold">
              {product.prix} DA
            </p>

            <p className="line-through text-white/50">
              DA 4,900.00
            </p>

            <span className="bg-[#DAAB3A] text-white text-sm px-3 py-1 rounded-full">
              SAVE - DA 500
            </span>
          </div>

          <hr className="border-white/20 mb-6" />

          {/* ✅ DESCRIPTION DYNAMIQUE */}
          {product.description && (
            <ul className="list-disc pl-5 space-y-2 mb-8 text-white/90">
              {product.description.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}

          {/* BOUTON */}
          <button className="w-full bg-white text-[#212E53] py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition">
            Ajouter au panier
          </button>

          {/* fallback */}
          {!product.description && (
            <p className="mt-6 text-white/70">
              Aucune description disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}  