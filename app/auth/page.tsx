"use client";

import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await res.json(); // parse JSON
      } catch {
        alert("Réponse serveur invalide !");
        return;
      }

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      // Si login réussi
      if (mode === "login" && data.token) {
        localStorage.setItem("token", data.token);

        // 🔹 Redirection selon rôle
        if (data.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      }

    } catch (err) {
      console.error(err);
      alert("Impossible de contacter le serveur");
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="bg-zinc-900 p-8 rounded-xl w-[400px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-zinc-800"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="p-3 rounded bg-zinc-800"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="bg-yellow-500 text-black p-3 rounded font-semibold">
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
        </form>

        <p
          className="text-center mt-4 cursor-pointer text-gray-400"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Créer un compte" : "Déjà un compte ?"}
        </p>
      </div>
    </div>
  );
}