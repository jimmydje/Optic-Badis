"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

interface Product {  
  id: string;
  nom: string;
  description?: string;
  images: string[]; // ✅ FIX IMPORTANT
  prix?: number;
  marque?: string;
  categorie?: string;
  createdAt?: string;
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
        console.error("Erreur chargement produit :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Chargement...</p>;
  if (!product) return <p className="p-6 text-center">Produit introuvable.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ---- IMAGE ---- */}
      <div className="flex items-center justify-center">
        <div className="relative w-full h-[420px]">
          <Image
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/images/default.jpg"
            }
            alt={product.nom}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* ---- INFOS ---- */}
      <div className="space-y-5">

        <h1 className="text-4xl font-bold">{product.nom}</h1>

        {/* ⭐⭐⭐⭐⭐ */}
        <div className="flex items-center gap-2 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} fill="#facc15" stroke="#facc15" />
          ))}
          <span className="text-gray-400">(464 Clients Satisfaits)</span>
        </div>

        {/* PRIX */}
        <div className="flex items-center gap-4">
          <p className="text-3xl font-bold text-white">
            {product.prix} DA
          </p>
          <p className="text-xl line-through text-white">
            DA 4,900.00
          </p>

          <span className="bg-[#DAAB3A] text-white text-sm px-3 py-1 rounded-full">
            SAVE - DA 500
          </span>
        </div>

        {/* Badge */}
        <div className="bg-red-100 text-red-600 border border-red-300 px-4 py-2 rounded-lg w-fit font-medium">
          ⚠️ Attention : édition limitée
        </div>

        {/* LISTE */}
        <ul className="list-disc pl-5 space-y-1 text-white">
          <li>Design confortable et léger</li>
          <li>Matériaux premium</li>
          <li>Protection UV</li>
          <li>Livraison 24–72h</li>
          <li>Paiement à la livraison</li>
          <li>SAV réactif</li>
        </ul>

        {/* BOUTON */}
        <button className="w-full bg-[#DAAB3A] text-white py-3 rounded-xl text-lg shadow-md hover:bg-[#c89b2f] transition">
          Ajouter au panier
        </button>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="pt-4 text-white">
            <h2 className="text-xl font-semibold mb-2">
              Description
            </h2>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}  