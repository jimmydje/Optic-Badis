"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PanierPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/get-session");
        const data = await res.json();

        if (data?.user) {
          setUser(data.user);
          setNom(data.user.nom || "");
          setEmail(data.user.email || "");
          setTelephone(data.user.telephone || "");
          setAdresse(data.user.adresse || "");
          setVille(data.user.ville || "");
        } else {
          router.push("/auth/sign-in");
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const removeFromCart = (id: string) => {
    const updated = cart.filter((i) => i.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.prix * item.quantite,
    0
  );

  const passerCommande = async () => {
    if (!nom || !email || !telephone || !adresse || !ville) return;

    await fetch("/api/commandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client: { nom, email, telephone, adresse, ville },
        total,
        items: cart.map((i) => ({
          produitId: i.id,
          quantite: i.quantite,
        })),
      }),
    });

    setCart([]);
    localStorage.removeItem("cart");
    alert("Commande envoyée !");
  };

  if (loading) return null;

  if (cart.length === 0) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          🛒 Votre panier
        </h1>
        <p className="text-gray-500">Votre panier est vide.</p>

        <a
          href="/"
          className="mt-6 bg-[#DAAB3A] text-white px-6 py-2 rounded-full"
        >
          Continuer vos achats
        </a>
      </main>
    );
  }

  return (
    <main className="px-4 md:px-10 py-8 bg-white min-h-screen text-black">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        🛍️ Votre panier
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border">

        {/* TABLE DESKTOP */}
        <div className="hidden md:block">
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b text-gray-600">
                <th>Produit</th>
                <th>Prix</th>
                <th>Quantité</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-3">{item.nom}</td>
                  <td>{item.prix} DA</td>
                  <td>{item.quantite}</td>
                  <td className="text-right">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4 mb-6">
          {cart.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{item.nom}</h3>
              <p className="text-sm text-gray-600">
                Prix: {item.prix} DA
              </p>
              <p className="text-sm">Quantité: {item.quantite}</p>

              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-2 text-red-500 text-sm"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        {/* FORM + TOTAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* FORM */}
          <div className="space-y-3">
            <h2 className="font-semibold">Informations client</h2>

            <input className="input" placeholder="Nom"
              value={nom} onChange={(e) => setNom(e.target.value)} />

            <input className="input" placeholder="Email"
              value={email} onChange={(e) => setEmail(e.target.value)} />

            <input className="input" placeholder="Téléphone"
              value={telephone} onChange={(e) => setTelephone(e.target.value)} />

            <input className="input" placeholder="Adresse"
              value={adresse} onChange={(e) => setAdresse(e.target.value)} />

            <input className="input" placeholder="Ville"
              value={ville} onChange={(e) => setVille(e.target.value)} />
          </div>

          {/* TOTAL */}
          <div className="flex flex-col justify-between">
            <div className="border p-4 rounded-xl text-right">
              <p className="text-gray-500">Total</p>
              <p className="text-2xl font-bold text-[#DAAB3A]">
                {total} DA
              </p>
            </div>

            <button
              onClick={passerCommande}
              disabled={!nom || !email || !telephone || !adresse || !ville}
              className="mt-4 w-full bg-[#DAAB3A] text-white py-3 rounded-xl disabled:bg-gray-300"
            >
              Passer la commande
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
          outline: none;
        }
      `}</style>
    </main>
  );
} 


























/* "use client";

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

          {/* Formulaire 
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

          {/* Total 
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
*/