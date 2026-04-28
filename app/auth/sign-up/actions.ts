'use server';

import { auth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const city = formData.get('city') as string;
  const address = formData.get('address') as string;

  // ✅ Validation basique
  if (!name || !email || !password || !phone || !city || !address) {
    return { error: 'All fields are required.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' };
  }

  // 👉 Création du compte
  const { error } = await auth.signUp.email({
  email,
  password,
  name: name?.trim(), 
});  

  if (error) {
    return { error: error.message || 'Failed to create account' };
  }

  // ✅ redirect après succès
  redirect('/');
}  