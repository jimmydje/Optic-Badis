"use client";

import { Facebook, Instagram, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-200 mt-16">

      {/* TOP */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold text-black mb-4 uppercase">
            Contactez-nous
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} />
            <span>opticbadis.algerie@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} className="text-red-500" />
            <span>+213 559 09 76 46</span>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold text-black mb-4 uppercase">
            Get on the list
          </h3>

          <div className="flex items-center border-b border-black">
            <input
              type="email"
              placeholder="Adresse e-mail"
              className="w-full bg-transparent outline-none py-2"
            />
            <button className="text-sm font-semibold hover:opacity-70">
              OK
            </button>
          </div>
        </div>

        {/* SOCIAL */}
        <div className="flex md:justify-end items-start gap-4">
          <Facebook className="cursor-pointer hover:opacity-70" />
          <Instagram className="cursor-pointer hover:opacity-70" />
          <span className="cursor-pointer font-bold hover:opacity-70">
            TikTok
          </span>
        </div>

      </div>

      {/* LOGO / BRAND */}
      <div className="text-center py-6">
        <h2 className="text-xl font-semibold tracking-widest">
          OPTIC BADIS
        </h2>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-sm text-gray-600 pb-6 px-4">
        © {new Date().getFullYear()} Optic Badis. Tous droits réservés.
      </div>

    </footer>
  );
}  