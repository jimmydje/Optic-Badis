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
    <div className="max-w-3xl mx-auto p-6">
      {/* IMAGE */}
      {product.imageUrl && (
        <div className="w-full h-80 relative mb-6">
          <Image
            src={product.imageUrl}
            alt={product.nom}
            fill
            className="object-contain rounded-xl"
          />
        </div>
      )}

      {/* INFO PRODUIT */}
      <h1 className="text-3xl font-bold mb-2">{product.nom}</h1>

      {product.marque && (
        <p className="text-gray-600 mb-2">Marque : {product.marque}</p>
      )}

      {product.categorie && (
        <p className="text-gray-600 mb-2">Catégorie : {product.categorie}</p>
      )}

      {product.prix !== undefined && (
        <p className="text-2xl font-semibold text-green-600 mb-4">
          {product.prix} DA
        </p>
      )}

      {/* DESCRIPTION */}
      {product.description && (
        <p className="text-gray-700 mt-4">{product.description}</p>
      )}
    </div>
  );
}
