"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  nom: string;
  description?: string;
  images: string[];
  prix?: number;
}

export default function ProduitDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/produits/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return <p className="text-center p-10">Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-black grid md:grid-cols-2">

      {/* LEFT - IMAGE */}
      <div className="flex flex-col items-center justify-center bg-gray-50 p-10">
        <div className="relative w-full max-w-xl h-[420px]">
          <Image
            src={product.images?.[mainImageIndex]}
            alt={product.nom}
            fill
            className="object-contain"
          />
        </div>

        {/* THUMBNAILS */}
        <div className="flex gap-3 mt-6">
          {product.images?.map((img, i) => (
            <div
              key={i}
              onClick={() => setMainImageIndex(i)}
              className={`w-20 h-16 border cursor-pointer rounded-md overflow-hidden transition ${
                i === mainImageIndex
                  ? "border-[#212E53]"
                  : "border-gray-300 hover:border-[#212E53]"
              }`}
            >
              <Image
                src={img}
                alt=""
                width={80}
                height={60}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - INFOS */}
      <div className="p-10 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">NOUVEAUTÉ • LUNETTES IA</p>
            <h1 className="text-3xl font-semibold mt-2 hover:text-[#212E53] transition">
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
        <div className="space-y-2">
          <p className="text-sm text-gray-500">MONTURE</p>
          <p className="font-medium">Gris</p>

          <p className="text-sm text-gray-500 mt-3">VERRES</p>
          <p className="font-medium">Bleu • Transitions®</p>
        </div>

        {/* VARIANTS */}
        <div className="flex gap-3 mt-4">
          {product.images?.map((img, i) => (
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

        {/* BUTTON */}
        <button className="mt-6 bg-[#212E53] text-white py-4 rounded-full text-lg hover:bg-[#1a2544] transition shadow-md">
          Ajouter au panier
        </button>

        {/* DESCRIPTION */}
        {product.description && (
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>
    </div>
  );
}  