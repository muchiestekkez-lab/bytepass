import Link from 'next/link';
import { Suspense } from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Login — BytePass' };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-3xl font-black gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]">
          BytePass ✈️
        </Link>
        <p className="text-slate-500 mt-2 text-sm">Welcome back, traveller.</p>
      </div>

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">Login</h1>
        {/* Suspense needed because LoginForm reads useSearchParams */}
        <Suspense fallback={<div className="h-40 animate-pulse bg-slate-100 rounded-xl" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-slate-500">
          No passport yet?{' '}
          <Link href="/register" className="font-semibold text-[#7B61FF] hover:underline">
            Create one →
          </Link>
        </p>
      </div>
    </div>
  );
}
