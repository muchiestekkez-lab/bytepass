import { PLATFORMS } from '@/lib/platforms';
import PassportStamp from './PassportStamp';

interface StampGridProps {
  visitedSlugs: Set<string>;
}

export default function StampGrid({ visitedSlugs }: StampGridProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-3xl p-6 shadow-card">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 justify-items-center">
        {PLATFORMS.map((platform) => (
          <PassportStamp
            key={platform.slug}
            name={platform.name}
            emoji={platform.emoji}
            gradient={platform.gradient}
            collected={visitedSlugs.has(platform.slug)}
          />
        ))}
      </div>
      {visitedSlugs.size === 0 && (
        <p className="text-center text-slate-400 text-sm mt-4">
          Log flights to collect stamps! ✈️
        </p>
      )}
    </div>
  );
}
