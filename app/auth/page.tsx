"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAuthClient } from "@neondatabase/auth";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Neon Auth client
  const authClient = createAuthClient(
    "https://ep-nameless-morning-agyfz4ox.neonauth.c-2.eu-central-1.aws.neon.tech"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response;

      if (mode === "login") {
        // 🔹 Connexion
        response = await authClient.signIn.email({
          email,
          password,
        });
      } else {
        // 🔹 Création de compte
        response = await authClient.signUp.email({
          email,
          password,
          name: "",
        });
      }

      if (!response || response.error) {
        setError(response?.error?.message || "Erreur de connexion");
        setLoading(false);
        return;
      }

      console.log("Utilisateur connecté :", response);

      // 🔹 Stockage du token dans un cookie
      if ('token' in response && response.token) {
        // expiration 7 jours
        const expires = new Date(); 
        expires.setDate(expires.getDate() + 7);
        document.cookie = `token=${response.token}; path=/; expires=${expires.toUTCString()}; Secure; SameSite=Lax`;
      }

      // 🔹 Redirection après succès
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-[400px] shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="p-3 rounded bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-black p-3 rounded font-semibold hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {loading
              ? mode === "login"
                ? "Connexion..."
                : "Inscription..."
              : mode === "login"
              ? "Se connecter"
              : "S'inscrire"}
          </button>
        </form>

        <p
          className="text-center mt-4 cursor-pointer text-gray-400 hover:text-yellow-500 transition"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Créer un compte" : "Déjà un compte ?"}
        </p>
      </div>
    </div>
  );
}