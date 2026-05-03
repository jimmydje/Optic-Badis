"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Produit {
  prix: any;
  marque: string;
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

  // ✅ ROUTING CORRECT
  const getProductLink = (produit: Produit) => {
    switch (produit.categorie) {
      case "homme":
        return `/homme/${produit.id}`;
      case "femme":
        return `/femme/${produit.id}`;
      case "solaire.homme":
        return `/solaire/hommes/${produit.id}`;
      case "solaire.femme":
        return `/solaire/femmes/${produit.id}`;
      case "enfants":
        return `/enfants/${produit.id}`;
      default:
        return `/homme/${produit.id}`; // fallback
    }
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

    {/* HERO */}
<section className="relative h-[100dvh] sm:h-[90vh] flex items-center justify-center text-center overflow-hidden">

  {/* IMAGE MOBILE */}
  <Image
    src="/images/123.jpg"
    alt="Badis Optic mobile"
    fill
    priority
    className="object-cover block sm:hidden"
  />

  {/* IMAGE DESKTOP */}
  <Image
    src="/images/image1.jpg" 
    alt="Badis Optic desktop"
    fill
    priority
    className="object-cover hidden sm:block"
  /> 

  {/* overlay */}
  <div className="absolute inset-0 bg-black/40" />

  {/* content */}
  <div className="relative z-10 max-w-3xl px-4 text-white">
    <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight">
      Une vision claire, un style affirmé
    </h1>

    <p className="mt-4 text-sm sm:text-lg text-neutral-200">
      Badis Optic vous accompagne avec des solutions optiques modernes.
    </p>

    <Link href="/promotions">
      <button className="mt-6 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 transition">
        Découvrir nos promotions
      </button>
    </Link>
  </div>

</section>

      {/* CATÉGORIES */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10">
            Nos catégories
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { href: "/homme", img: "/images/image2.jpg", label: "HOMME" },
              { href: "/femme", img: "/images/image3.jpg", label: "FEMME" },
              { href: "/solaire/hommes", img: "/images/image4.jpg", label: "SOLAIRE Homme" },
              { href: "/solaire/femmes", img: "/images/image6.jpg", label: "SOLAIRE Femme" },
              { href: "/enfants", img: "/images/image7.jpg", label: "ENFANTS" },
            ].map((cat) => (
              <Link key={cat.href} href={cat.href}>
                <div className="relative h-52 sm:h-60 rounded-2xl overflow-hidden">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover hover:scale-110 transition"
                  />

                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white text-lg font-semibold">
                    {cat.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="py-16 px-4 bg-[#B67332]">  
        <div className="max-w-6xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-10 items-center">

          <div className="text-center md:text-left order-1 max-w-xl mx-auto md:mx-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-white">
              Notre histoire
            </h2>

            <p className="text-white text-sm sm:text-base leading-relaxed">
              Badis Optic est né d’une passion profonde pour la vision et le style, avec la volonté de proposer bien plus que de simples lunettes : une véritable expérience alliant confort visuel et élégance. Depuis sa création, la marque s’engage à offrir des produits de qualité, soigneusement sélectionnés pour répondre aux besoins de chacun, tout en suivant les dernières tendances. Grâce à un savoir-faire professionnel et une attention particulière aux détails, Badis Optic accompagne ses clients dans le choix de montures qui reflètent leur personnalité et s’adaptent à leur quotidien. Plus qu’une simple boutique, Badis Optic incarne une vision moderne de l’optique, où bien voir rime avec confiance et style.
            </p>
          </div>

          <div className="relative h-48 sm:h-64 md:h-80 w-full rounded-2xl overflow-hidden order-2">
            <Image
              src="/images/image5.jpg"
              alt="Boutique"
              fill
              className="object-cover"
            />
          </div>

        </div>
      </section>

     {/* PRODUITS */}
<section className="py-16 px-4 bg-[#f5f5f5]">
  <div className="max-w-7xl mx-auto">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-10">
     <h2 className="text-4xl font-bold tracking-tight text-center w-full">
  Nouveautés 
</h2> 
     
    </div>

    {/* PRODUITS CENTRÉS */}
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl">

        {produits.slice(0, 3).map((p) => (
          <Link key={p.id} href={getProductLink(p)}>

            <div className="group cursor-pointer">

              {/* CARD */}
              <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">

                {/* IMAGE */}
                <div className="h-60 flex items-center justify-center bg-[#f9f9f9] p-4">
                  <Image
                    src={getImageSrc(p.images?.[0])}
                    alt={p.nom}
                    width={300}
                    height={200}
                    className="object-contain max-h-full w-auto transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* BANDE NOIRE */}
                <div className="absolute bottom-0 left-0 w-full bg-black text-white py-3 px-4 flex items-center gap-2 text-sm font-medium">
                  
                  {/* ICON */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7M9 7V5a3 3 0 016 0v2" />
                  </svg>

                  Achetez avec paiement à la livraison
                </div>

              </div>

              {/* INFOS */}
              <div className="mt-3">
                <p className="font-semibold text-gray-900 text-sm">
                  {p.nom}
                </p>

                <p className="text-gray-600 text-sm">
                  {new Intl.NumberFormat("fr-DZ").format(p.prix)} DA
                </p>
              </div>

            </div>

          </Link>
        ))}

      </div>
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