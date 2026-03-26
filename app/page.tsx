"use client";
import { auth } from '@/lib/auth/server';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


interface Produit {
  id: string;
  nom: string;
  imageUrl: string | null;
  categorie: string | null;
  createdAt: string;
}
// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default function HomePage() {


  const [produits, setProduits] = useState<Produit[]>([]);

  const getImageSrc = (url: string | null) => {
    if (!url) return "/images/image1.jpg";
    if (url.startsWith("/")) return url;
    if (url.startsWith("http")) return url;
    return "/images/image1.jpg";
  };

  useEffect(() => {
    fetch("/api/produits?limit=3")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProduits(data);
        } else {
          console.error("API n'a pas renvoyé un tableau :", data);
          setProduits([]);
        }
      })
      .catch((err) => {
        console.error("Erreur chargement produits :", err);
        setProduits([]);
      });
  }, []);

  return (
    <div className="w-full text-white">
      {/* HERO */}
      <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/image1.jpg"
          alt="Badis Optic"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />   

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 max-w-3xl px-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Une vision claire, un style affirmé
          </h1>

          <p className="mt-6 text-lg text-neutral-200">
            Badis Optic vous accompagne avec des solutions optiques modernes,
            élégantes et adaptées à votre quotidien.
          </p>

          <Link href="/promotions">
            <button className="mt-10 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition">
              Découvrir nos promotions
            </button>
          </Link>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Notre histoire
            </h2>
            <p className="text-neutral-300 leading-relaxed">
              Badis Optic est né d’une passion pour la vision et le détail.
              Depuis nos débuts à Annaba, nous mettons notre expertise au
              service de votre confort visuel et de votre style.
            </p>
            <p className="text-neutral-300 mt-4 leading-relaxed">
              Chaque monture est sélectionnée avec soin pour allier
              performance, esthétique et durabilité.
            </p>
          </div>

          <div className="relative h-80 rounded-3xl overflow-hidden">
            <Image
              src="/images/image5.jpg"
              alt="Boutique Badis Optic"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14">
            Nouveautés
          </h2>

          {produits.length === 0 ? (
            <p className="text-center text-neutral-400">
              Aucun produit récent
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {produits.map((produit) => {
                let categoriePath = "homme";

                if (produit.categorie?.toLowerCase() === "femme")
                  categoriePath = "femme";
                if (produit.categorie?.toLowerCase() === "enfant")
                  categoriePath = "enfants";
                if (produit.categorie?.toLowerCase() === "lentilles")
                  categoriePath = "lentilles";

                return (
                  <Link
                    key={produit.id}
                    href={`/${categoriePath}/${produit.id}`}
                  >
                    <div className="group bg-neutral-900 rounded-3xl p-6 hover:bg-neutral-800 transition cursor-pointer">
                      <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                        <Image
                          src={getImageSrc(produit.imageUrl)}
                          alt={produit.nom}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      <h3 className="text-xl font-medium">
                        {produit.categorie || "Produit"}
                      </h3>

                      <p className="text-neutral-400 text-sm mt-2">
                        {produit.nom}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Contactez-nous
          </h2>
          <p className="text-neutral-300 mb-14">
            Notre équipe est à votre écoute pour vous conseiller et vous
            accompagner.
          </p>

          <div className="space-y-6 text-neutral-300">
            <div>
              <h4 className="text-white font-medium mb-2">Adresse</h4>
              <p>Annaba, Algérie</p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Téléphone</h4>
              <p>+213 550 35 27 02</p>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Horaires</h4>
              <p>Sam – Jeu : 9h à 20h</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}