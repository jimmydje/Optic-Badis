// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
/* 
// Liste des routes protégées
const protectedRoutes = ["/admin", "/admin/produits", "/admin/clients"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Exemple : récupérer le token depuis les cookies
  const token = req.cookies.get("token")?.value;

  // Si la route est protégée et pas de token, redirige vers /auth
  if (protectedRoutes.some((path) => url.pathname.startsWith(path))) {
    if (!token) {
      url.pathname = "/auth";
      return NextResponse.redirect(url);
    }
  } 

  return NextResponse.next();
}

// Définir les chemins où le middleware s'applique
export const config = {
  matcher: ["/admin/:path*"],
};
*/
// ✅ Middleware ACTIF (ne bloque rien)
export function middleware(request: NextRequest) {
  return NextResponse.next();
}