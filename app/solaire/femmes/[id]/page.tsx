"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  nom: string;
  description?: string;
  images: string[];
  prix?: number;
  marque?: string;
  categorie?: string;
}

export default function ProduitDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/produits/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6 text-center">Chargement...</p>;
  if (!product) return <p className="p-6 text-center">Produit introuvable.</p>;

  return (
    <div className="min-h-screen bg-white text-black grid md:grid-cols-2">

      {/* ===== LEFT (IMAGE) ===== */}
      <div className="bg-gray-50 flex flex-col items-center justify-center p-6 md:p-10">

        <div className="relative w-full max-w-xl h-[350px] md:h-[420px]">
          <Image
            src={product.images?.[mainImageIndex]}
            alt={product.nom}
            fill
            className="object-contain"
          />
        </div>

        {/* MINIATURES */}
        <div className="flex gap-3 mt-6 flex-wrap justify-center">
          {product.images.map((img, i) => (
            <div
              key={i}
              onClick={() => setMainImageIndex(i)}
              className={`w-20 h-16 border rounded-md overflow-hidden cursor-pointer transition ${
                i === mainImageIndex
                  ? "border-[#DAAB3A]"
                  : "border-gray-300 hover:border-[#DAAB3A]"
              }`}
            >
              <Image src={img} alt="" width={80} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT (INFOS) ===== */}
      <div className="p-6 md:p-10 flex flex-col gap-6">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-semibold hover:text-[#DAAB3A] transition">
          {product.nom}
        </h1>

        {/* PRIX */}
        <p className="text-2xl font-semibold text-[#DAAB3A]">
          {product.prix} DA
        </p>

        {/* DESCRIPTION */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>
        )}

        {/* VARIANTES */}
        <div className="flex gap-3 mt-2 flex-wrap">
          {product.images.map((img, i) => (
            <div
              key={i}
              className="w-20 h-16 border rounded-md overflow-hidden hover:border-[#DAAB3A] transition"
            >
              <Image src={img} alt="" width={80} height={60} />
            </div>
          ))}
        </div>

        {/* BOUTON */}
        <button className="mt-6 w-full bg-[#DAAB3A] text-white py-4 rounded-full text-lg hover:opacity-90 transition shadow-md">
          Ajouter au panier
        </button>

      </div>
    </div>
  );
} 