'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GoogleButton from './GoogleButton';

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    internetYear: String(new Date().getFullYear() - 5),
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, internetYear: Number(form.internetYear) }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Registration failed');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Google Sign-Up — fastest path */}
      <GoogleButton label="Sign up with Google (Fastest)" />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">or fill in manually</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
        <input
          type="text"
          required
          minLength={3}
          maxLength={20}
          pattern="[a-zA-Z0-9_]+"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
          placeholder="internet_explorer_420"
        />
        <p className="text-xs text-slate-400 mt-1">Letters, numbers, underscores only.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
          placeholder="you@internet.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          When did you start using the internet?
        </label>
        <select
          value={form.internetYear}
          onChange={(e) => setForm({ ...form, internetYear: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
        >
          {Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
        <p className="text-xs text-slate-400 mt-1">This determines your Internet Age.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Bio <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          rows={2}
          maxLength={160}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors resize-none"
          placeholder="Professional internet lurker. Part-time meme archivist."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] hover:opacity-90 hover:scale-[1.02] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating passport...' : 'Create Passport 🛂'}
      </button>
    </form>
    </div>
  );
}
