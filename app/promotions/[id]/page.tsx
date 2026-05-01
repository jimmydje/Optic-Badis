"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";

interface Product {
    id: string;
    nom: string;
    description?: string;
    prix: number;
    imageUrl?: string | null;
    promotion?: number | null;
}

export default function PromotionDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch("/api/promotions", {
                    cache: "no-store",
                });

                const data = await res.json();
                const list: Product[] = data?.promotions ?? [];

                const found = list.find((p) => p.id === id);

                setProduct(found || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // 🔥 PANIER (même logique que ta page Femme)
    const addToCart = (product: Product) => {
        try {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");

            const image =
                product.imageUrl || "/images/default.jpg";

            const index = cart.findIndex((item: any) => item.id === product.id);

            if (index !== -1) {
                cart[index].quantite += 1;
            } else {
                cart.push({
                    id: product.id,
                    nom: product.nom,
                    prix: product.prix,
                    image,
                    quantite: 1,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));

            // 🔥 sync panier live
            window.dispatchEvent(new Event("cartUpdated"));

            console.log("Ajouté au panier:", product.nom);
        } catch (error) {
            console.error("Erreur panier :", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Chargement...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Produit introuvable
            </div>
        );
    }

    const prixFinal =
        product.prix - (product.prix * Number(product.promotion || 0)) / 100;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 flex justify-center">
            <div className="max-w-5xl w-full bg-white rounded-3xl shadow-lg overflow-hidden grid md:grid-cols-2">

                {/* IMAGE */}
                <div className="relative h-80 md:h-full bg-gray-50">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.nom}
                            fill
                            className="object-contain p-6"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            Pas d’image
                        </div>
                    )}
                </div>

                {/* INFOS */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#212E53]">
                        {product.nom}
                    </h1>

                    <p className="text-gray-500 mt-4">
                        {product.description || "Aucune description disponible"}
                    </p>

                    <div className="mt-6 space-y-2">
                        <p className="text-lg line-through text-gray-400">
                            {product.prix} DA
                        </p>

                        <p className="text-2xl font-bold text-green-600">
                            {prixFinal.toFixed(2)} DA
                        </p>

                        <span className="inline-block mt-2 bg-[#212E53] text-white px-3 py-1 rounded-full text-sm">
                            -{product.promotion}% OFF
                        </span>
                    </div>

                    {/* BOUTON PANIER */}
                    <button
                        onClick={() => addToCart(product)}
                        className="mt-8 w-full bg-[#212E53] text-white py-3 rounded-full hover:opacity-90 transition"
                    >
                        Ajouter au panier
                    </button>
                </div>
            </div>
        </div>
    );
}  