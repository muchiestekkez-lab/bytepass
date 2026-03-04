'use client';

import { useState } from 'react';

const EMOJIS = ['❤️', '😂', '🔥', '✈️'];

interface ReactionsProps {
  flightId: string;
  initialCounts: Record<string, number>;
  initialMine: string[];
}

export default function FlightCardReactions({ flightId, initialCounts, initialMine }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  const [mine, setMine] = useState<Set<string>>(new Set(initialMine));
  const [loading, setLoading] = useState<string | null>(null);

  async function toggle(emoji: string) {
    setLoading(emoji);
    try {
      const res = await fetch(`/api/flights/${flightId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      if (res.status === 401) return; // not logged in — silently ignore
      if (!res.ok) return;

      const data = await res.json();
      setCounts((prev) => ({
        ...prev,
        [emoji]: data.reacted
          ? (prev[emoji] ?? 0) + 1
          : Math.max((prev[emoji] ?? 0) - 1, 0),
      }));
      setMine((prev) => {
        const next = new Set(prev);
        if (data.reacted) next.add(emoji);
        else next.delete(emoji);
        return next;
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {EMOJIS.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const active = mine.has(emoji);
        return (
          <button
            key={emoji}
            onClick={() => toggle(emoji)}
            disabled={loading === emoji}
            title={active ? `Remove ${emoji} reaction` : `React with ${emoji}`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all disabled:opacity-50 ${
              active
                ? 'bg-violet-100 border border-violet-300 text-violet-700'
                : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-violet-50 hover:border-violet-200'
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
