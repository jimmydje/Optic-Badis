"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Produit {
  id: string;
  nom: string;
  images: string[];
  categorie: string | null;
  createdAt: string;
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [produits, setProduits] = useState<Produit[]>([]);

  const getImageSrc = (url: string | null | undefined) => {
    if (!url || url.trim() === "") return "/images/image1.jpg";
    if (url.startsWith("/")) return url;
    if (url.startsWith("http")) return url;
    return "/images/image1.jpg";
  };

  useEffect(() => {
    fetch("/api/produits?limit=3")
      .then((res) => res.json())
      .then((data) => {
        setProduits(Array.isArray(data) ? data : []);
      })
      .catch(() => setProduits([]));
  }, []);

  return (
    <div className="w-full text-black bg-neutral-100">

      {/* HERO RESPONSIVE */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/image1.jpg"
          alt="Badis Optic"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />

        <div className="relative z-10 max-w-3xl px-4 sm:px-6 text-white">
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
            Une vision claire, un style affirmé
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-neutral-200">
            Badis Optic vous accompagne avec des solutions optiques modernes.
          </p>

          <Link href="/promotions">
            <button className="mt-6 sm:mt-10 px-6 sm:px-8 py-2 sm:py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition text-sm sm:text-base">
              Découvrir nos promotions
            </button>
          </Link>
        </div>
      </section>

      {/* CATÉGORIES MOBILE FIX */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10 sm:mb-14">
            Nos catégories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { href: "/homme", img: "/images/image2.jpg", label: "HOMME" },
              { href: "/femme", img: "/images/image3.jpg", label: "FEMME" },
              { href: "/solaire/hommes", img: "/images/image4.jpg", label: "SOLAIRE H" },
              { href: "/solaire/femmes", img: "/images/image6.jpg", label: "SOLAIRE F" },
              { href: "/enfants", img: "/images/image7.jpg", label: "ENFANTS" },
            ].map((cat) => (
              <Link key={cat.href} href={cat.href}>
                <div className="relative h-40 sm:h-52 rounded-xl sm:rounded-2xl overflow-hidden">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover hover:scale-110 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm sm:text-lg font-semibold">
                    {cat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HISTOIRE MOBILE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#212E53]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 sm:gap-14 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-white">
              Notre histoire
            </h2>

            <p className="text-white text-sm sm:text-base leading-relaxed">
              Badis Optic est né d’une passion pour la vision et le style.
            </p>
          </div>

          <div className="relative h-56 sm:h-80 rounded-2xl overflow-hidden">
            <Image
              src="/images/image5.jpg"
              alt="Boutique"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* MARQUES MOBILE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-10 sm:mb-14">
            Nos marques
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 sm:gap-10">
            {["rayban", "oakley", "police", "gucci", "prada", "dior"].map((b) => (
              <Image
                key={b}
                src={`/brands/${b}.png`}
                alt={b}
                width={100}
                height={50}
                className="mx-auto opacity-70 hover:opacity-100 transition"
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUITS MOBILE FIX */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-neutral-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10 sm:mb-14">
            Nouveautés
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {produits.map((p) => (
              <Link key={p.id} href={`/produit/${p.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                  <div className="relative h-56 sm:h-64">
                    <Image
                      src={getImageSrc(p.images?.[0])}
                      alt={p.nom}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="bg-[#212E53] text-white p-4">
                    <p className="text-sm sm:text-base font-semibold">
                      {p.nom}
                    </p>
                    <p className="text-xs text-neutral-300">
                      {p.categorie ?? "Optique"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT MOBILE */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-neutral-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
            Contact
          </h2>

          <p className="text-sm sm:text-base text-neutral-600 mb-10">
            Notre équipe est disponible pour vous aider.
          </p>

          <div className="text-sm sm:text-base space-y-4">
            <p>📍 Annaba, Algérie</p>
            <p>📞 +213 550 35 27 02</p>
            <p>🕒 9h - 20h</p>
          </div>
        </div>
      </section>

    </div>
  );
}

























/*"use client";
import { auth } from '@/lib/auth/server';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Produit {
  id: string;
  nom: string;
  images: string[]; // ✅ tableau
  categorie: string | null;
  createdAt: string;
}  

// Server components using auth methods must be rendered dynamically
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [produits, setProduits] = useState<Produit[]>([]);

  const getImageSrc = (url: string | null) => {
    if (!url) return "/images/image1.jpg"; // image par défaut
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
      {/* HERO 
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

      {/* HISTOIRE 
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

      {/* NOUVEAUTÉS 
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

                const imageSrc = getImageSrc(produit.images?.[0] || null);

                return (
                  <Link key={produit.id} href={`/${categoriePath}/${produit.id}`}>
                    <div className="group bg-neutral-900 rounded-3xl p-6 hover:bg-neutral-800 transition cursor-pointer">
                      <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={produit.nom}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="bg-neutral-800 w-full h-full flex items-center justify-center">
                            <span className="text-neutral-500">Pas d'image</span>
                          </div>
                        )}
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

      {/* CONTACT 
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
*/ 