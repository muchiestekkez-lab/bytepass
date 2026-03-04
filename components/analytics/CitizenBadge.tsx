import { getCitizenLevel } from '@/lib/utils';

interface CitizenBadgeProps {
  totalFlights: number;
  size?: 'sm' | 'md';
}

export default function CitizenBadge({ totalFlights, size = 'md' }: CitizenBadgeProps) {
  const level = getCitizenLevel(totalFlights);

  return (
    <div
      className={`inline-flex items-center gap-2 bg-gradient-to-r ${level.color} text-white rounded-2xl shadow-md ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
      }`}
    >
      <span className={size === 'sm' ? 'text-base' : 'text-xl'}>{level.emoji}</span>
      <div>
        <div className={`font-bold ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{level.title}</div>
        {size === 'md' && (
          <div className="text-white/70 text-xs">
            {totalFlights} flight{totalFlights !== 1 ? 's' : ''}
            {level.next !== null && ` · ${level.next - totalFlights} to next`}
          </div>
        )}
      </div>
    </div>
  );
}
