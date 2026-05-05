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
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* IMAGE */}
        <div className="flex items-center justify-center p-6 md:p-12 bg-gray-50">
          {product.imageUrl && (
            <div className="relative w-full max-w-xl h-[350px] md:h-[420px]">
              <Image
                src={product.imageUrl}
                alt={product.nom}
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* INFOS */}
        <div className="p-6 md:p-12 flex flex-col justify-center gap-6">

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
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              {product.description.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              Aucune description disponible.
            </p>
          )}

          {/* BOUTON */}
          <button className="mt-6 w-full bg-[#DAAB3A] text-white py-4 rounded-full text-lg hover:opacity-90 transition shadow-md">
            Ajouter au panier
          </button>

        </div>
      </div>
    </div>
  );
} 