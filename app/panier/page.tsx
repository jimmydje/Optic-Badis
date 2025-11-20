"use client";

import { useState, useEffect } from "react";

export default function PanierPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  // Charger le panier depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Supprimer un produit
  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calcul du total
  const total = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);

  // 🧾 Envoyer la commande vers ton API Prisma
  const passerCommande = async () => {
    if (!nom || !email || !telephone) {
      alert("Veuillez remplir toutes vos coordonnées !");
      return;
    }

    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { nom, email, telephone },
          total,
          items: cart.map((item) => ({
            produitId: item.id,
            quantite: item.quantite,
          })),
        }),
      });

      if (res.ok) {
        alert("✅ Commande enregistrée avec succès !");
        setCart([]);
        localStorage.removeItem("cart");
        setNom("");
        setEmail("");
        setTelephone("");
      } else {
        alert("❌ Erreur lors de l’enregistrement de la commande.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Erreur serveur !");
    }
  };

  // Si le panier est vide
  if (cart.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 text-gray-800">
        <h1 className="text-3xl font-semibold mb-4">🛒 Votre panier</h1>
        <p className="text-lg text-gray-600">
          Votre panier est actuellement vide.
        </p>

        <a
          href="/"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Continuer vos achats
        </a>
      </main>
    );
  }

  // Si le panier contient des produits
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        🛍️ Votre panier
      </h1>

      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Produit</th>
              <th className="py-2">Prix</th>
              <th className="py-2">Quantité</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{item.nom}</td>
                <td className="py-2">{item.prix} DA</td>
                <td className="py-2">{item.quantite}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Formulaire coordonnées client */}
        <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="border px-3 py-2 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-2 rounded-lg"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-800">
              Total : {total.toFixed(2)} DA
            </p>
            <button
              onClick={passerCommande}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Passer la commande
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
