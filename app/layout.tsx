import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata = {
  title: "Badis Optic",
  description: "Opticien moderne à Annaba",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col bg-white text-black antialiased">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENU PRINCIPAL */}
        <main className="flex-grow">
          {children}
        </main>

        {/* FOOTER */}
        <Footer />

      </body>
    </html>
  );
} 