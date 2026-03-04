'use client';

import { useState } from 'react';

const EMOJIS = ['❤️', '😂', '🔥', '✈️'];

interface ReactionsProps {
  flightId: string;
  initialCounts: Record<string, number>;
  initialMine: string[]; // 0 or 1 item — the emoji this viewer reacted with
}

export default function FlightCardReactions({ flightId, initialCounts, initialMine }: ReactionsProps) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);
  // myReaction: the single emoji this user picked, or null
  const [myReaction, setMyReaction] = useState<string | null>(initialMine[0] ?? null);
  const [loading, setLoading] = useState(false);

  async function pick(emoji: string) {
    // Already picked this one — do nothing
    if (myReaction === emoji) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/flights/${flightId}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      });
      if (res.status === 401) return; // not logged in — silently ignore
      if (!res.ok) return;

      const data = await res.json();
      if (!data.changed) return; // same emoji, no change

      setCounts((prev) => {
        const next = { ...prev };
        // decrement old emoji count
        if (data.oldEmoji) {
          next[data.oldEmoji] = Math.max((next[data.oldEmoji] ?? 1) - 1, 0);
        }
        // increment new emoji count
        next[emoji] = (next[emoji] ?? 0) + 1;
        return next;
      });
      setMyReaction(emoji);
    } finally {
      setLoading(false);
    }
  }

  const hasReacted = myReaction !== null;

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        {EMOJIS.map((emoji) => {
          const count = counts[emoji] ?? 0;
          const active = myReaction === emoji;
          return (
            <button
              key={emoji}
              onClick={() => pick(emoji)}
              disabled={loading}
              title={active ? 'Your reaction' : hasReacted ? `Switch to ${emoji}` : `React with ${emoji}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all disabled:opacity-50 ${
                active
                  ? 'bg-gradient-to-r from-[#FF6EC7]/20 to-[#7B61FF]/20 border-2 border-[#7B61FF]/40 text-[#7B61FF] scale-110'
                  : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700'
              }`}
            >
              <span className="text-base leading-none">{emoji}</span>
              {count > 0 && <span className="text-xs">{count}</span>}
            </button>
          );
        })}
      </div>
      {!hasReacted && (
        <p className="text-[11px] text-slate-400 mt-2">Pick a reaction — you can only choose once</p>
      )}
      {hasReacted && (
        <p className="text-[11px] text-slate-400 mt-2">You reacted {myReaction} · tap another to switch</p>
      )}
    </div>
  );
}
