"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  nom: string;
  description?: string;  
  imageUrl?: string;
  prix?: number;
  marque?: string;
  categorie?: string;
  createdAt?: string;
}

export default function LentilleDetailPage() {
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
        console.error("Erreur chargement lentille :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6 text-center">Chargement...</p>;
  if (!product) return <p className="p-6 text-center">Lentille introuvable.</p>;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="bg-gray-50 flex items-center justify-center p-6">
          <div className="relative w-full max-w-xl h-[350px] md:h-[420px]">
            <Image
              src={product.imageUrl || "/images/image1.jpg"}
              alt={product.nom}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>

        {/* INFOS */}
        <div className="flex flex-col justify-center gap-6">

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-semibold hover:text-[#DAAB3A] transition">
            {product.nom}
          </h1>

          {/* PRIX */}
          <p className="text-2xl font-semibold text-[#DAAB3A]">
            {product.prix} DA
          </p>

          {/* DESCRIPTION */}
          {product.description ? (
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm">
              Aucune description disponible.
            </p>
          )}

          {/* BOUTON */}
          <button className="mt-4 w-full bg-[#DAAB3A] text-white py-4 rounded-full text-lg hover:opacity-90 transition shadow-md">
            Ajouter au panier
          </button>

        </div>
      </div>
    </div>
  );
} 