import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create Passport — Cloud Trip' };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <Link href="/" className="font-display text-3xl font-black gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]">
          Cloud Trip ☁️✈️
        </Link>
        <p className="text-slate-500 mt-2 text-sm">Create your Internet Passport.</p>
      </div>

      {/* Card */}
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-card">
        <h1 className="font-display text-2xl font-bold text-slate-800 mb-6">
          Get Your Passport 🛂
        </h1>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have one?{' '}
          <Link href="/login" className="font-semibold text-[#7B61FF] hover:underline">
            Login →
          </Link>
        </p>
      </div>
    </div>
  );
}
