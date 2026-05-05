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
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/produits/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error();

        setProduct(data);
      } catch (error) {
        console.error("Erreur produit :", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  function addToCart(product: Product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = cart.findIndex(
      (item: any) => item.id === product.id
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    setToast("Produit ajouté au panier ✔");
    setTimeout(() => setToast(null), 2000);
  }

  if (loading) return <p className="text-center p-10">Chargement...</p>;
  if (!product) return <p className="text-center p-10">Produit introuvable</p>;

  const images = product.images || [];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">

        {/* ===== LEFT IMAGE ===== */}
        <div className="bg-gray-50 flex flex-col items-center justify-center p-6 md:p-10">

          {images.length > 0 ? (
            <>
              <div className="relative w-full max-w-xl h-[350px] md:h-[420px]">
                <Image
                  src={images[mainImageIndex]}
                  alt={product.nom}
                  fill
                  className="object-contain"
                />
              </div>

              {/* MINIATURES */}
              <div className="flex gap-3 mt-6 flex-wrap justify-center">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    className={`w-20 h-16 rounded-md overflow-hidden border cursor-pointer ${
                      idx === mainImageIndex
                        ? "border-[#DAAB3A]"
                        : "border-gray-300 hover:border-[#DAAB3A]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={product.nom}
                      width={80}
                      height={60}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Aucune image</p>
          )}
        </div>

        {/* ===== RIGHT INFOS ===== */}
        <div className="p-6 md:p-10 flex flex-col gap-6 justify-center">

          {/* TITLE */}
          <h1 className="text-2xl md:text-3xl font-semibold hover:text-[#DAAB3A] transition">
            {product.nom}
          </h1>

          {/* PRIX */}
          <p className="text-2xl font-semibold text-[#DAAB3A]">
            {product.prix ?? 0} DA
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description || "Aucune description disponible."}
          </p>

          {/* BOUTON */}
          <button
            onClick={() => addToCart(product)}
            className="mt-6 w-full bg-[#DAAB3A] text-white py-4 rounded-full text-lg hover:opacity-90 transition shadow-md"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-[#DAAB3A] text-white px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
} 