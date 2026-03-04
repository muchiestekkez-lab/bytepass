'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Platform } from '@prisma/client';

const REASONS = [
  'Chasing better memes',
  'Avoiding my ex',
  'Professional networking (lying)',
  'Doom-scrolling upgrade',
  'The algorithm made me',
  'Clout migration',
  'Vibes were off',
  'Research purposes 🙂',
];

export default function FlightForm() {
  const router = useRouter();
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ fromId: '', toId: '', reason: '' });

  useEffect(() => {
    fetch('/api/platforms')
      .then((r) => r.json())
      .then((d) => setPlatforms(d.data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/flights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Failed to log flight');
      return;
    }

    // Navigate to the boarding pass
    router.push(`/boarding/${data.data.id}`);
  };

  const selectedFrom = platforms.find((p) => p.id === form.fromId);
  const selectedTo = platforms.find((p) => p.id === form.toId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* From */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Flying From 🛫
        </label>
        <div className="relative">
          {selectedFrom && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{selectedFrom.emoji}</span>
          )}
          <select
            required
            value={form.fromId}
            onChange={(e) => setForm({ ...form, fromId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors appearance-none"
            style={{ paddingLeft: selectedFrom ? '2.5rem' : '1rem' }}
          >
            <option value="">Select a platform...</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === form.toId}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* To */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Landing At 🛬
        </label>
        <div className="relative">
          {selectedTo && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{selectedTo.emoji}</span>
          )}
          <select
            required
            value={form.toId}
            onChange={(e) => setForm({ ...form, toId: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors appearance-none"
            style={{ paddingLeft: selectedTo ? '2.5rem' : '1rem' }}
          >
            <option value="">Select a platform...</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === form.fromId}>
                {p.emoji} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Reason{' '}
          <span className="text-slate-400 font-normal">(optional but fun)</span>
        </label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          rows={3}
          maxLength={200}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:border-[#7B61FF] transition-colors resize-none"
          placeholder="Be honest..."
        />
        {/* Quick reasons */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, reason: r })}
              className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-600 hover:bg-[#7B61FF]/10 hover:text-[#7B61FF] transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !form.fromId || !form.toId}
        className="w-full py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] shadow-md hover:shadow-glow-purple hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading ? 'Boarding...' : '✈️ Log This Flight'}
      </button>
    </form>
  );
}
