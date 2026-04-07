import { auth } from '@/lib/auth/server';
import { NextResponse } from 'next/server';

export default auth.middleware({
  loginUrl: '/auth/sign-in',
});

export const config = {
  matcher: [
    '/account/:path*',
    '/admin/:path*', // 🔥 ajouter admin ici
  ],
};  