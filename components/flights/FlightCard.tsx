import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { FlightWithPlatforms } from '@/types';

interface FlightCardProps {
  flight: FlightWithPlatforms & { user?: { username: string } };
}

export default function FlightCard({ flight }: FlightCardProps) {
  return (
    <div className="group bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-4 shadow-sm hover:shadow-card hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* From */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${flight.from.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}
        >
          {flight.from.emoji}
        </div>

        {/* Route */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-slate-800">{flight.from.name}</span>
            <span className="text-slate-400">→</span>
            <span className="font-bold text-sm text-slate-800">{flight.to.name}</span>
          </div>
          {flight.reason && (
            <p className="text-slate-500 text-xs mt-0.5 italic truncate">
              &quot;{flight.reason}&quot;
            </p>
          )}
          <p className="text-slate-400 text-xs mt-0.5">
            {flight.flightNumber} · {formatDate(flight.createdAt)}
          </p>
        </div>

        {/* To */}
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${flight.to.gradient} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}
        >
          {flight.to.emoji}
        </div>

        {/* Boarding pass link */}
        <Link
          href={`/boarding/${flight.id}`}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-[#7B61FF] bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 transition-colors opacity-0 group-hover:opacity-100"
        >
          Pass →
        </Link>
      </div>
    </div>
  );
}
