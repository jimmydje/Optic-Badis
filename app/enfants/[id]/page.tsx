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
}

export default function ProduitDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);

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

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* ===== IMAGE ===== */}
        <div className="bg-gray-50 flex flex-col items-center justify-center p-6 md:p-12">

          <div className="relative w-full max-w-xl h-[350px] md:h-[420px]">
            <Image
              src={images[mainImageIndex] || "/images/default.jpg"}
              alt={product.nom}
              fill
              className="object-contain"
            />
          </div>

          {/* MINIATURES */}
          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainImageIndex(i)}
                className={`w-20 h-16 border rounded-md overflow-hidden cursor-pointer ${
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

        {/* ===== INFOS ===== */}
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