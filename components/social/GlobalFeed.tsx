'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PlatformLogo from '@/components/ui/PlatformLogo';

export interface FeedFlight {
  id: string;
  flightNumber: string;
  reason: string | null;
  createdAt: string | Date;
  user: { username: string; avatar: string | null };
  from: { name: string; slug: string; color: string };
  to:   { name: string; slug: string; color: string };
  _count: { reactions: number; comments: number };
}

interface GlobalFeedProps {
  initialFlights: FeedFlight[];
  endpoint: string; // '/api/feed/global' or '/api/feed/following'
}

function timeAgo(dateStr: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function FeedFlightCard({ flight }: { flight: FeedFlight }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-start gap-3 hover:shadow-md transition-shadow">
      {/* avatar */}
      <Link href={`/u/${flight.user.username}`}>
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-sm font-black"
          style={{ background: 'linear-gradient(135deg,#FF6EC7,#7B61FF)' }}
        >
          {flight.user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={flight.user.avatar} alt={flight.user.username} className="w-full h-full object-cover" />
          ) : (
            flight.user.username[0].toUpperCase()
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        {/* header */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href={`/u/${flight.user.username}`} className="text-sm font-bold text-slate-800 hover:underline">
            @{flight.user.username}
          </Link>
          <span className="text-slate-400 text-xs">flew from</span>
          {/* from */}
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${flight.from.color}18`, color: flight.from.color }}
          >
            <PlatformLogo slug={flight.from.slug} className="w-3.5 h-3.5" color={flight.from.color} />
            {flight.from.name.split('/')[0]}
          </span>
          <span className="text-slate-400 text-xs">→</span>
          {/* to */}
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${flight.to.color}18`, color: flight.to.color }}
          >
            <PlatformLogo slug={flight.to.slug} className="w-3.5 h-3.5" color={flight.to.color} />
            {flight.to.name.split('/')[0]}
          </span>
        </div>

        {/* reason */}
        {flight.reason && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">"{flight.reason}"</p>
        )}

        {/* meta */}
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
          <span>{flight.flightNumber}</span>
          <span>{timeAgo(flight.createdAt)}</span>
          {flight._count.reactions > 0 && <span>❤️ {flight._count.reactions}</span>}
          {flight._count.comments > 0 && <span>💬 {flight._count.comments}</span>}
          <Link href={`/boarding/${flight.id}`} className="text-violet-400 hover:text-violet-600">
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GlobalFeed({ initialFlights, endpoint }: GlobalFeedProps) {
  const [flights, setFlights] = useState<FeedFlight[]>(initialFlights);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await fetch(endpoint, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setFlights(data);
            setLastUpdated(new Date());
          }
        }
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, [endpoint]);

  if (flights.length === 0) {
    return (
      <div className="text-center py-12 bg-white/60 rounded-3xl border border-white/60">
        <div className="text-4xl mb-3">✈️</div>
        <p className="text-slate-400 text-sm">No flights here yet. Be the first to fly!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-slate-400">
          {loading ? 'Refreshing…' : `Live · auto-refreshes every 30s`}
        </p>
        <p className="text-[11px] text-slate-400">
          Updated {timeAgo(lastUpdated.toISOString())}
        </p>
      </div>
      <div className="space-y-2.5">
        {flights.map((f) => (
          <FeedFlightCard key={f.id} flight={f} />
        ))}
      </div>
    </div>
  );
}
