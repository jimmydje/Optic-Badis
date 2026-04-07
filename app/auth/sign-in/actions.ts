'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }
  
  const { data, error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }

  // 🔐 sécurité (au cas où user est null)
  if (!data?.user) {
    return { error: 'User not found.' };
  }

  const user = data.user;

  // ✅ redirection selon rôle
  if ((user as { role?: string }).role === 'admin') {
    redirect('/admin');
  }

  redirect('/');
}

// ✅ LOGOUT
export async function signOut() {
  await auth.signOut();
  redirect('/auth/sign-in');
}  












/*use server';
import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
export async function signInWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const { error } = await auth.signIn.email({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });
  if (error) {
    return { error: error.message || 'Failed to sign in. Try again' };
  }
  redirect('/');
}
  */