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

  // ✅ FIX IMPORTANT
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

        if (!res.ok) {
          throw new Error(data?.error || "Produit introuvable");
        }

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

        {/* IMAGE */}
        <div className="flex flex-col items-center justify-center p-10">

          {images.length > 0 ? (
            <>
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-gray-50">
                <Image
                  src={images[mainImageIndex]}
                  alt={product.nom}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex gap-3 mt-6">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border cursor-pointer ${
                      idx === mainImageIndex
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={product.nom}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No image</p>
          )}
        </div>

        {/* INFOS */}
        <div className="bg-[#212E53] text-white p-10 flex flex-col justify-center space-y-6">

          <h1 className="text-3xl font-bold">{product.nom}</h1>

          <p className="text-2xl font-semibold">
            DA {product.prix ?? 0}
          </p>

          <div className="bg-white/20 py-3 text-center rounded">
            Disponible
          </div>

          <hr className="border-white/30" />

          <p className="text-sm text-white/80">
            {product.description || "Aucune description disponible."}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-white text-[#212E53] py-3 font-semibold rounded-lg"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg">
          {toast}
        </div>
      )}
    </div>
  );
}  