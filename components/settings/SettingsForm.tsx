'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  username: string;
  currentInternetYear: number;
  currentBio: string;
}

export default function SettingsForm({ username, currentInternetYear, currentBio }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [internetYear, setInternetYear] = useState(String(currentInternetYear));
  const [bio, setBio] = useState(currentBio);

  const currentYear = new Date().getFullYear();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const res = await fetch('/api/user/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internetYear: Number(internetYear), bio }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Update failed');
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Editing profile for <strong>@{username}</strong>
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
          Profile updated! ✅
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          When did you start using the internet?
        </label>
        <select
          value={internetYear}
          onChange={(e) => setInternetYear(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors"
        >
          {Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year}>
              {year} {year === currentYear ? '(this year)' : `(${currentYear - year} yr${currentYear - year !== 1 ? 's' : ''} online)`}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-400 mt-1">This sets your Internet Age on your passport.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Bio <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={160}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors resize-none"
          placeholder="Professional internet lurker. Part-time meme archivist."
        />
        <p className="text-xs text-slate-400 mt-1">{bio.length}/160</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] hover:opacity-90 hover:scale-[1.02] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save Changes ✅'}
      </button>
    </form>
  );
}
