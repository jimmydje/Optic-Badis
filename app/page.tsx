"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Produit {
  id: string;
  nom: string;
  imageUrl: string;
  categorie: "OPTIQUE" | "SOLAIRE" | "LENTILLE";
  createdAt: string;
}

export default function HomePage() {
  const [produits, setProduits] = useState<{
    optique?: Produit;
    solaire?: Produit;
    lentille?: Produit;
  }>({});

  useEffect(() => {
    fetch("/api/products/last-by-category")
      .then((res) => res.json())
      .then((data) => setProduits(data));
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

          <Link href="/collections">
            <button className="mt-10 px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition">
              Découvrir nos collections
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
              src="/images/image1.jpg"
              alt="Boutique Badis Optic"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* NOS COLLECTIONS (DYNAMIQUE) */}
      <section className="py-24 px-6 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-14">
            Nos collections
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {produits.optique && (
              <Link href={`/produit/${produits.optique.id}`}>
                <div className="group bg-neutral-900 rounded-3xl p-6 hover:bg-neutral-800 transition cursor-pointer">
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={produits.optique.imageUrl}
                      alt={produits.optique.nom}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="text-xl font-medium">Optique</h3>
                  <p className="text-neutral-400 text-sm mt-2">
                    {produits.optique.nom}
                  </p>
                </div>
              </Link>
            )}

            {produits.solaire && (
              <Link href={`/produit/${produits.solaire.id}`}>
                <div className="group bg-neutral-900 rounded-3xl p-6 hover:bg-neutral-800 transition cursor-pointer">
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={produits.solaire.imageUrl}
                      alt={produits.solaire.nom}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="text-xl font-medium">Solaire</h3>
                  <p className="text-neutral-400 text-sm mt-2">
                    {produits.solaire.nom}
                  </p>
                </div>
              </Link>
            )}

            {produits.lentille && (
              <Link href={`/produit/${produits.lentille.id}`}>
                <div className="group bg-neutral-900 rounded-3xl p-6 hover:bg-neutral-800 transition cursor-pointer">
                  <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                    <Image
                      src={produits.lentille.imageUrl}
                      alt={produits.lentille.nom}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h3 className="text-xl font-medium">Lentilles</h3>
                  <p className="text-neutral-400 text-sm mt-2">
                    {produits.lentille.nom}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-6 bg-neutral-900">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Contactez-nous
          </h2>
          <p className="text-neutral-300 mb-14">
            Notre équipe est à votre écoute pour vous conseiller et vous
            accompagner.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-neutral-300">
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
