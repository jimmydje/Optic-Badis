'use client';

import { useActionState } from 'react';
import { signInWithEmail } from './actions';
import Link from 'next/link';

export default function SignInForm() {
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center bg-gray-900"
    >
      <div className="w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold text-white">
          Sign in to your account
        </h1>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label className="text-sm font-medium text-gray-100">
          Email address
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="john@my-company.com"
          className="rounded-md w-full bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 outline outline-1 outline-white/10 focus:outline-indigo-500"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label className="text-sm font-medium text-gray-100">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          placeholder="*****"
          className="rounded-md w-full bg-white/5 px-3 py-2 text-white placeholder:text-gray-500 outline outline-1 outline-white/10 focus:outline-indigo-500"
        />
      </div>

      {/* Error */}
      {state?.error && (
        <div className="rounded-md px-3 py-2 text-sm text-red-500">
          {state.error}
        </div>
      )}

      {/* Sign in button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-sm rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        {isPending ? "Loading..." : "Sign in"}
      </button>

      {/* Sign up link */}
      <p className="text-sm text-gray-400">
        Don’t have an account?{" "}
        <Link
          href="/auth/sign-up" 
          className="text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}  