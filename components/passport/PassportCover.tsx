import { formatDate } from '@/lib/utils';

interface PassportCoverProps {
  username: string;
  bio: string | null;
  internetAge: number;
  citizenLevel: { title: string; emoji: string; color: string };
  createdAt: Date;
  totalFlights: number;
}

export default function PassportCover({
  username,
  bio,
  internetAge,
  citizenLevel,
  createdAt,
  totalFlights,
}: PassportCoverProps) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-700/30">
      {/* Cover */}
      <div className="passport-texture px-8 py-10 text-white">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-widest mb-1">
              Internet Passport
            </p>
            <p className="text-white/50 text-xs">BYTEPASS · DIGITAL REPUBLIC</p>
          </div>
          <div className="text-4xl opacity-80">🛂</div>
        </div>

        <div className="flex items-end gap-6">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF6EC7] to-[#7B61FF] flex items-center justify-center text-3xl flex-shrink-0 shadow-glow-pink">
            {username[0].toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-blue-200/60 text-xs uppercase tracking-widest mb-0.5">Passport Holder</p>
            <h2 className="font-display text-2xl font-black text-white truncate">@{username}</h2>
            {bio && (
              <p className="text-blue-200/70 text-xs mt-1 line-clamp-2">{bio}</p>
            )}
          </div>
        </div>

        {/* Citizen badge */}
        <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5">
          <span className="text-lg">{citizenLevel.emoji}</span>
          <span className="text-sm font-bold text-white">{citizenLevel.title}</span>
        </div>
      </div>

      {/* Info strip */}
      <div className="bg-white/90 grid grid-cols-3 divide-x divide-slate-100">
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Internet Age</p>
          <p className="font-display text-2xl font-black text-slate-800">{internetAge}</p>
          <p className="text-xs text-slate-400">years online</p>
        </div>
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total Flights</p>
          <p className="font-display text-2xl font-black text-slate-800">{totalFlights}</p>
          <p className="text-xs text-slate-400">logged</p>
        </div>
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Issued</p>
          <p className="font-display text-base font-bold text-slate-800">{formatDate(createdAt)}</p>
          <p className="text-xs text-slate-400">join date</p>
        </div>
      </div>
    </div>
  );
}
