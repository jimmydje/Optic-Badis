"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

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
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ---- IMAGE ---- */}
      <div className="flex items-center justify-center">
        {product.imageUrl && (
          <div className="relative w-full h-[420px]">
            <Image
              src={product.imageUrl}
              alt={product.nom}
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>
        )}
      </div>

      {/* ---- INFOS ---- */}
      <div className="space-y-5">

        {/* TITRE */}
        <h1 className="text-4xl font-bold">{product.nom}</h1>

        {/* ⭐⭐⭐⭐⭐ AVIS */}
        <div className="flex items-center gap-2 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} fill="#facc15" stroke="#facc15" />
          ))}
          <span className="text-gray-600">(312 Utilisateurs satisfaits)</span>
        </div>

        {/* PRIX */}
        <div className="flex items-center gap-4">
          <p className="text-3xl font-bold text-white">{product.prix} DA</p>
          <p className="text-xl line-through text-white">DA 6,200.00</p>

          <span className="bg-[#DAAB3A] text-white text-sm px-3 py-1 rounded-full">
            PROMO - DA 400
          </span>
        </div>

        {/* Badge */}
        <div className="bg-red-100 text-red-600 border border-red-300 px-4 py-2 rounded-lg w-fit font-medium">
          👁️ Lentilles certifiées & sécurisées
        </div>

        {/* AVANTAGES LENTILLES */}
        <ul className="list-disc pl-5 space-y-1 text-white">
          <li>Confort longue durée</li>
          <li>Hydratation optimale</li>
          <li>Vision nette et stable</li>
          <li>Usage journalier / mensuel</li>
          <li>Livraison 24–72h</li>
          <li>Paiement à la livraison</li>
        </ul>

        {/* ---- BOUTON BLEU ---- */}
        <button className="w-full bg-[#DAAB3A] text-white py-3 rounded-xl text-lg shadow-md  transition">
          Ajouter au panier
        </button>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="pt-4 text-white">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
