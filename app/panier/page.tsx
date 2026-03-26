"use client";

import { useState, useEffect } from "react";

export default function PanierPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.prix * item.quantite, 0);

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
        alert("✅ Commande enregistrée !");
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        alert("Erreur lors de la commande");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white">
        <h1 className="text-3xl font-bold mb-4">🛒 Votre panier</h1>
        <p className="text-gray-400">Votre panier est vide.</p>

        <a
          href="/"
          className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
        >
          Continuer vos achats
        </a>
      </main>
    );
  }

  return (
    <main className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🛍️ Votre panier
      </h1>

      <div className="bg-[#111] rounded-xl shadow-lg p-6 border border-gray-800">

        <table className="w-full text-left">
          <thead>
  <tr className="border-b border-gray-700 text-gray-400">
    <th className="py-2">Image</th>
    <th className="py-2">Produit</th>
    <th className="py-2">Prix</th>
    <th className="py-2">Quantité</th>
    <th className="py-2 text-right">Actions</th>
  </tr>
</thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item.id} className="border-b border-gray-800">
                <td className="py-3">{item.nom}</td>
                <td className="py-3">{item.prix} DA</td>
                <td className="py-3">{item.quantite}</td>

                <td className="py-3 text-right">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 grid md:grid-cols-2 gap-6">

          {/* Formulaire */}
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="bg-black border border-gray-700 px-4 py-2 rounded-lg focus:border-yellow-500 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-gray-700 px-4 py-2 rounded-lg focus:border-yellow-500 outline-none"
            />

            <input
              type="tel"
              placeholder="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="bg-black border border-gray-700 px-4 py-2 rounded-lg focus:border-yellow-500 outline-none"
            />
          </div>

          {/* Total */}
          <div className="flex flex-col justify-center items-end">
            <p className="text-xl font-semibold mb-3">
              Total : <span className="text-yellow-500">{total} DA</span>
            </p>

            <button
              onClick={passerCommande}
              className="bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-400 transition"
            >
              Passer la commande
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}