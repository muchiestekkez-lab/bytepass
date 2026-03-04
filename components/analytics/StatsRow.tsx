interface StatsRowProps {
  totalFlights: number;
  stampCount: number;
  internetAge: number;
}

const stat = (label: string, value: string | number, emoji: string) => ({
  label,
  value,
  emoji,
});

export default function StatsRow({ totalFlights, stampCount, internetAge }: StatsRowProps) {
  const stats = [
    stat('Total Flights', totalFlights, '✈️'),
    stat('Stamps', `${stampCount}/9`, '📬'),
    stat('Internet Age', `${internetAge}y`, '🌐'),
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm text-center hover:shadow-card transition-all"
        >
          <div className="text-2xl mb-2">{s.emoji}</div>
          <div className="font-display text-2xl font-black text-slate-800">{s.value}</div>
          <div className="text-xs text-slate-400 mt-0.5 uppercase tracking-widest">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
