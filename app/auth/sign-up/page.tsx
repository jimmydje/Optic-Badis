'use client';
import { useActionState } from 'react';
import { signUpWithEmail } from './actions';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUpWithEmail, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 min-h-screen items-center justify-center bg-gray-900"
    >
      <div className="w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold text-white">
          Create new account
        </h1>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="name" className="text-sm text-gray-100">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="John Doe"
          className="input"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="phone" className="text-sm text-gray-100">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="0550 00 00 00"
          className="input"
        />
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="city" className="text-sm text-gray-100">City</label>
        <input
          id="city"
          name="city"
          type="text"
          required
          placeholder="Algiers"
          className="input"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="address" className="text-sm text-gray-100">Address</label>
        <input
          id="address"
          name="address"
          type="text"
          required
          placeholder="Street, building..."
          className="input"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="email" className="text-sm text-gray-100">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="john@mail.com"
          className="input"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 w-sm">
        <label htmlFor="password" className="text-sm text-gray-100">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="*****"
          className="input"
        />
      </div>

      {/* Error */}
      {state?.error && (
        <div className="text-red-500 text-sm">{state.error}</div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-sm rounded-md bg-indigo-500 py-2 text-white hover:bg-indigo-400"
      >
        {isPending ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}  