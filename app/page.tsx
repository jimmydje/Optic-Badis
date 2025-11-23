"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Produit {
  id: string;
  nom: string;
  description?: string;
  prix?: number;
  imageUrl?: string;
  categorie?: string;
}

export default function Home() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔵 État pour afficher le formulaire modal
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchProduits() {
      try {
        const res = await fetch("/api/produits?limit=3");
        const data = await res.json();
        setProduits(data);
      } catch (error) {
        console.error("Erreur en récupérant les produits :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduits();
  }, []);

  const placeholderProduits = [1, 2, 3];

  // 🔵 Fonction d’envoi du formulaire
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = {
      nom: e.target.nom.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Votre message a été envoyé !");
      setShowForm(false);
    } else {
      alert("Erreur lors de l’envoi.");
    }
  };

  return (
    <main className="text-gray-900">

      {/* 1ère partie */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[90vh] flex items-center justify-start bg-gray-100">
        <Image
          src="/images/image1.jpg"
          alt="femme avec lunettes"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-2xl px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            The perfect <br /> Look
          </h1>
          <p className="text-white mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
            Our sunglasses are designed to protect your eyes both from excessive
            light and harmful UV rays.
          </p>
        </div>
      </section>

      {/* Nouveautés */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-6 bg-white">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold text-center text-gray-800 mb-8 sm:mb-10">
          Nouveautés
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {loading
            ? placeholderProduits.map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden shadow-md animate-pulse bg-gray-200"
                >
                  <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-300" />
                  <div className="p-4 space-y-2">
                    <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 rounded w-1/2" />
                    <div className="h-5 bg-gray-300 rounded w-1/4 mt-2" />
                  </div>
                </div>
              ))
            : produits.map((produit) => (
                <div
                  key={produit.id}
                  className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <img
                    src={produit.imageUrl || "/placeholder.jpg"}
                    alt={produit.nom}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-base sm:text-lg md:text-lg">
                      {produit.nom}
                    </h3>
                    {produit.description && (
                      <p className="text-gray-600 text-xs sm:text-sm md:text-sm">
                        {produit.description}
                      </p>
                    )}
                    {produit.prix !== undefined && (
                      <p className="text-blue-600 font-bold text-sm sm:text-base md:text-base">
                        {produit.prix} DA
                      </p>
                    )}
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Promo */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-6 bg-blue-50">
        <h2 className="text-2xl sm:sm:text-3xl md:text-3xl font-semibold text-center text-gray-800 mb-8 sm:mb-10">
          Offres et Promotions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {["Pack Découverte", "Pack Premium", "Pack Luxe"].map((pack, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-2">
                {pack}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base md:text-base">
                sur toutes les montures {idx === 0 ? "classiques" : idx === 1 ? "modernes" : "haut de gamme"}
              </p>
              <div className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-red-500 mb-4">
                {idx === 0 ? "-20%" : idx === 1 ? "-30%" : "-35%"}
              </div>

              <Link href="/promotions">
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Profiter
                </button>
              </Link>

            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-6 bg-gray-100 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-6 text-blue-700">
          Contact
        </h2>
        <p className="max-w-xl mx-auto mb-6 sm:mb-8 text-gray-700 text-sm sm:text-base md:text-base">
          Une question ? Besoin d’un conseil ? Contactez-nous ou passez à la boutique.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">

          {/* 🔵 Ouvre le formulaire */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Envoyer un e-mail
          </button>

          <a
            href="tel:+213555555555"
            className="border border-blue-600 text-blue-600 px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-50 text-sm sm:text-base"
          >
            +213-657-411-145
          </a>
        </div>
      </section>

      {/* 🔵 FORMULAIRE MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">

            <h3 className="text-xl font-bold mb-4 text-center">Envoyer un message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Votre e-mail"
                className="w-full p-2 border rounded"
                required
              />

              <textarea
                name="message"
                placeholder="Votre message"
                className="w-full p-2 border rounded h-28"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </main>
  );
}
