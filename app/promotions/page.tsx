"use client";

import Image from "next/image";

export default function PromotionsPage() {

  const promotions = {
    section20: [
      {
        nom: "ray-ban",
        description: "Lunette de soleil tendance",
        prix: 2990,
        imageUrl: "/images/rayban.png",
      },
      {
        nom: "Polar",
        description: "Monture légère premium",
        prix: 49999.97,
        imageUrl: "/images/polar.png",
      },
      {
        nom: "Sinal",
        description: "Un produit de qualité",
        prix: 799.99,
        imageUrl: "/images/sinal.png",
      },
    ],

    section30: [
      { nom: "Produit A", description: "Description...", prix: 1500, imageUrl: "/images/a.png" },
      { nom: "Produit B", description: "Description...", prix: 2200, imageUrl: "/images/b.png" },
      { nom: "Produit C", description: "Description...", prix: 990, imageUrl: "/images/c.png" },
    ],

    section35: [
      { nom: "Produit X", description: "Monture luxe", prix: 4990, imageUrl: "/images/x.png" },
      { nom: "Produit Y", description: "Modèle exclusif", prix: 6990, imageUrl: "/images/y.png" },
      { nom: "Produit Z", description: "Collection prestige", prix: 8990, imageUrl: "/images/z.png" },
    ],
  };

  const Section = ({ title, pack, products }: any) => (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600">{title}</h2>
      <p className="text-gray-500 mb-6">{pack}</p>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((prod: any, i: number) => (
          <div key={i} className="bg-white rounded-xl shadow-xl p-5 cursor-pointer hover:scale-105 transition">
            <div className="w-full h-56 bg-gray-100 rounded-lg flex items-center justify-center">
              <Image src={prod.imageUrl} alt={prod.nom} width={200} height={200} className="object-contain" />
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-800">{prod.nom}</h3>
            <p className="text-gray-600 text-sm">{prod.description}</p>

            <p className="mt-3 text-blue-600 font-bold text-lg">{prod.prix} DA</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-16 bg-gray-50 min-h-screen">
      <Section title="Promotion -20%" pack="Pack Découverte" products={promotions.section20} />
      <Section title="Promotion -30%" pack="Pack Premium" products={promotions.section30} />
      <Section title="Promotion -35%" pack="Pack Luxe" products={promotions.section35} />
    </div>
  );
}
