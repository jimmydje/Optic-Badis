/*
"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth";

// 🔹 Initialise le client Neon Auth avec ton URL 
const authClient = createAuthClient({ 
  baseUrl: "https://ep-nameless-morning-agyfz4ox.neonauth.c-2.eu-central-1.aws.neon.tech", // Remplace par ton URL Neon Auth
}); 

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔹 Connexion via Neon Auth
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Erreur de connexion");
        setLoading(false);
        return;
      }

      console.log("Utilisateur connecté :", data);

      // 🔹 Redirection après login réussi
      redirect("/admin/produits"); 

    } catch (err) {
      console.error("Erreur login :", err);
      setError("Erreur serveur");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Connexion Admin
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border p-3 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
  */