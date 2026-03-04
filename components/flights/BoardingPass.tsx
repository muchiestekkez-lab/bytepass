import { formatDate } from '@/lib/utils';
import type { Platform, Flight } from '@prisma/client';

type BoardingPassFlight = Flight & {
  from: Platform;
  to: Platform;
  user: { username: string };
};

export default function BoardingPass({ flight }: { flight: BoardingPassFlight }) {
  const date = formatDate(flight.createdAt);

  return (
    <div className="w-full max-w-lg">
      {/* Main ticket body */}
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/40">
        {/* Gradient header */}
        <div
          className="px-8 pt-8 pb-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${flight.from.color}dd 0%, #7B61FF 50%, ${flight.to.color}dd 100%)`,
          }}
        >
          {/* Airline branding */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">BytePass Airways</p>
              <p className="text-white font-bold text-lg">BOARDING PASS</p>
            </div>
            <span className="text-4xl">✈️</span>
          </div>

          {/* Route */}
          <div className="flex items-center justify-between gap-4">
            {/* From */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg"
                style={{ backgroundColor: `${flight.from.color}33`, border: `2px solid ${flight.from.color}66` }}
              >
                {flight.from.emoji}
              </div>
              <p className="text-2xl font-black">{flight.from.name.split('/')[0].slice(0, 3).toUpperCase()}</p>
              <p className="text-white/70 text-xs">{flight.from.name}</p>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="text-white/40 text-xs uppercase tracking-widest">FLIGHT</div>
              <div className="flex items-center gap-1 text-white/80">
                <div className="h-px flex-1 bg-white/30" />
                <span className="text-lg">→</span>
                <div className="h-px flex-1 bg-white/30" />
              </div>
              <div className="text-white text-sm font-bold">{flight.flightNumber}</div>
            </div>

            {/* To */}
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-2 shadow-lg"
                style={{ backgroundColor: `${flight.to.color}33`, border: `2px solid ${flight.to.color}66` }}
              >
                {flight.to.emoji}
              </div>
              <p className="text-2xl font-black">{flight.to.name.split('/')[0].slice(0, 3).toUpperCase()}</p>
              <p className="text-white/70 text-xs">{flight.to.name}</p>
            </div>
          </div>
        </div>

        {/* Torn edge */}
        <div className="relative bg-white flex">
          {/* Left scallop */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around pointer-events-none -translate-x-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-slate-100" />
            ))}
          </div>
          {/* Dashed divider */}
          <div className="w-px border-l-2 border-dashed border-slate-200 mx-8 my-2" />
        </div>

        {/* Ticket info */}
        <div className="bg-white px-8 pb-8 pt-5">
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">Passenger</p>
              <p className="font-bold text-slate-800">@{flight.user.username}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">Date</p>
              <p className="font-bold text-slate-800">{date}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">Flight No.</p>
              <p className="font-bold text-slate-800 font-mono">{flight.flightNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-0.5">Class</p>
              <p className="font-bold text-slate-800">DIGITAL ✨</p>
            </div>
          </div>

          {/* Reason */}
          {flight.reason && (
            <div className="bg-slate-50 rounded-2xl px-4 py-3 mb-5">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Reason for travel</p>
              <p className="text-slate-700 text-sm italic">&quot;{flight.reason}&quot;</p>
            </div>
          )}

          {/* Barcode strip (decorative) */}
          <div className="flex items-end gap-px h-10 justify-center opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800 w-0.5 rounded-full"
                style={{ height: `${20 + Math.random() * 80}%` }}
              />
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-300 mt-2 font-mono tracking-widest">
            BYTEPASS · STAMP YOUR INTERNET
          </p>
        </div>
      </div>
    </div>
  );
}
