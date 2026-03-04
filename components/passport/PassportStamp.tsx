import { cn } from '@/lib/utils';

interface PassportStampProps {
  name: string;
  emoji: string;
  gradient: string;
  collected: boolean;
}

export default function PassportStamp({ name, emoji, gradient, collected }: PassportStampProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl transition-all duration-300',
        collected
          ? `bg-gradient-to-br ${gradient} shadow-stamp hover:scale-110 animate-bounce-in`
          : 'bg-slate-100 opacity-40 grayscale'
      )}
    >
      {/* Dashed ring */}
      {collected && (
        <div className="absolute inset-1 rounded-xl stamp-border pointer-events-none" />
      )}

      <span className={cn('text-3xl', !collected && 'opacity-50')}>{emoji}</span>
      <span
        className={cn(
          'text-[10px] font-bold mt-1 text-center px-1 leading-tight truncate w-full text-center',
          collected ? 'text-white drop-shadow-sm' : 'text-slate-400'
        )}
      >
        {name.split('/')[0]}
      </span>

      {/* "STAMPED" diagonal overlay */}
      {collected && (
        <div className="absolute top-1 right-1 bg-white/25 rounded-full w-4 h-4 flex items-center justify-center">
          <span className="text-white text-[8px] font-black">✓</span>
        </div>
      )}
    </div>
  );
}
