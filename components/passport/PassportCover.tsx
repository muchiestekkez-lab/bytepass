import { formatDate } from '@/lib/utils';
import { PLATFORMS } from '@/lib/platforms';
import PlatformLogo from '@/components/ui/PlatformLogo';

interface PassportCoverProps {
  username: string;
  bio: string | null;
  avatar?: string | null;
  internetAge: number;
  citizenLevel: { title: string; emoji: string; color: string };
  createdAt: Date;
  totalFlights: number;
  visitedSlugs: Set<string>;
}

export default function PassportCover({
  username,
  bio,
  avatar,
  internetAge,
  citizenLevel,
  createdAt,
  totalFlights,
  visitedSlugs,
}: PassportCoverProps) {
  return (
    <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/40">
      {/* ── Cover page ── */}
      <div className="passport-texture px-8 py-10 text-white">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Internet Passport
            </p>
            <p className="text-white/40 text-[10px] tracking-widest">CLOUD TRIP · DIGITAL REPUBLIC</p>
          </div>
          <span className="text-3xl">☁️✈️</span>
        </div>

        <div className="flex items-end gap-5">
          {/* Avatar — photo or initials fallback */}
          <div className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden shadow-lg border-2 border-white/20"
            style={{ background: 'linear-gradient(135deg,#FF6EC7,#7B61FF)' }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
                {username[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-blue-200/50 text-[10px] uppercase tracking-widest mb-0.5">Passport Holder</p>
            <h2 className="font-display text-2xl font-black text-white truncate">@{username}</h2>
            {bio && <p className="text-blue-200/60 text-xs mt-1 line-clamp-2">{bio}</p>}
          </div>
        </div>

      </div>

      {/* ── Stats strip ── */}
      <div className="bg-white grid grid-cols-3 divide-x divide-slate-100">
        <div className="px-4 py-4 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Internet Age</p>
          <p className="font-display text-2xl font-black text-slate-800">{internetAge}</p>
          <p className="text-[10px] text-slate-400">years online</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Total Flights</p>
          <p className="font-display text-2xl font-black text-slate-800">{totalFlights}</p>
          <p className="text-[10px] text-slate-400">logged</p>
        </div>
        <div className="px-4 py-4 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Issued</p>
          <p className="font-display text-sm font-bold text-slate-800 leading-tight mt-1">{formatDate(createdAt)}</p>
          <p className="text-[10px] text-slate-400">join date</p>
        </div>
      </div>

      {/* ── Visa Stamps pages ── */}
      <div className="px-7 py-6" style={{ background: 'linear-gradient(135deg,#f5f0e8 0%,#ede8d8 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-800/60">Visa Stamps</p>
          <p className="text-xs text-amber-700/50 font-mono">
            {visitedSlugs.size}/{PLATFORMS.length} collected
          </p>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {PLATFORMS.map((platform) => {
            const collected = visitedSlugs.has(platform.slug);
            return (
              <div key={platform.slug} className="flex flex-col items-center gap-1.5">
                {/* Stamp circle */}
                <div
                  className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={
                    collected
                      ? {
                          background: `linear-gradient(135deg,${platform.color}dd,${platform.color}88)`,
                          boxShadow: `0 0 0 2.5px ${platform.color}66, 0 3px 10px ${platform.color}44`,
                        }
                      : {
                          background: 'rgba(180,160,100,0.06)',
                          border: '2px dashed rgba(180,160,100,0.22)',
                        }
                  }
                >
                  {collected && (
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-white/30 pointer-events-none" />
                  )}
                  <PlatformLogo
                    slug={platform.slug}
                    className={collected ? 'w-7 h-7' : 'w-6 h-6 opacity-20'}
                    color={collected ? 'white' : 'rgba(120,90,40,0.5)'}
                  />
                  {collected && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[8px] font-black" style={{ color: platform.color }}>✓</span>
                    </div>
                  )}
                </div>
                <span
                  className="text-[9px] font-semibold text-center leading-tight w-full truncate"
                  style={{ color: collected ? '#5a3e1b' : 'rgba(120,90,40,0.3)', textAlign: 'center' }}
                >
                  {platform.name.split('/')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {visitedSlugs.size === 0 && (
          <p className="text-center text-amber-700/40 text-xs mt-4">
            Log flights to collect stamps ✈️
          </p>
        )}
      </div>
    </div>
  );
}
