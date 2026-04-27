"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, Heart } from "lucide-react";

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
      <div className="bg-gray-50 flex flex-col items-center justify-center p-10">

        <div className="relative w-full max-w-xl h-[420px]">
          <Image
            src={product.images?.[mainImageIndex]}
            alt={product.nom}
            fill
            className="object-contain"
          />
        </div>

        {/* MINIATURES */}
        <div className="flex gap-3 mt-6">
          {product.images.map((img, i) => (
            <div
              key={i}
              onClick={() => setMainImageIndex(i)}
              className={`w-20 h-16 border rounded-md overflow-hidden cursor-pointer transition ${
                i === mainImageIndex
                  ? "border-[#212E53]"
                  : "border-gray-300 hover:border-[#212E53]"
              }`}
            >
              <Image src={img} alt="" width={80} height={60} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== RIGHT (INFOS) ===== */}
      <div className="p-10 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">
              NOUVEAUTÉ • {product.categorie || "LUNETTES"}
            </p>

            <h1 className="text-3xl font-semibold mt-2">
              {product.nom}
            </h1>
          </div>

          <Heart className="cursor-pointer hover:text-[#212E53] transition" />
        </div>

       
        {/* PRIX */}
        <p className="text-2xl font-semibold text-[#212E53]">
          {product.prix} DA
        </p>

        {/* OPTIONS */}
        <div className="space-y-3">

          <div>
            <p className="text-sm text-gray-500">MONTURE</p>
            <p className="font-medium">Gris</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">VERRES</p>
            <p className="font-medium">Bleu • Transitions®</p>
          </div>

        </div>

        {/* VARIANTES */}
        <div className="flex gap-3">
          {product.images.map((img, i) => (
            <div
              key={i}
              className="w-20 h-16 border rounded-md overflow-hidden hover:border-[#212E53] transition"
            >
              <Image src={img} alt="" width={80} height={60} />
            </div>
          ))}
        </div>

        {/* TAILLE */}
        <div className="border-t pt-4 flex justify-between items-center cursor-pointer hover:text-[#212E53] transition">
          <span>TAILLE</span>
          <span>›</span>
        </div>

        {/* BOUTON */}
        <button className="mt-4 w-full bg-[#212E53] text-white py-4 rounded-full text-lg hover:bg-[#1a2544] transition">
          Ajouter au panier
        </button>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="text-gray-600 text-sm leading-relaxed pt-4">
            <h2 className="text-lg font-semibold text-black mb-2">
              Description
            </h2>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}  