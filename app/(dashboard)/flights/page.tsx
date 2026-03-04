import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import FlightCard from '@/components/flights/FlightCard';

export const metadata = { title: 'My Flights — Cloud Trip' };

export default async function FlightsPage() {
  const auth = await getAuthUser();
  if (!auth) redirect('/login');

  const flights = await prisma.flight.findMany({
    where: { userId: auth.userId },
    include: { from: true, to: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-black text-slate-800">All Flights ✈️</h1>
        <Link
          href="/flights/new"
          className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          + Log Flight
        </Link>
      </div>

      {flights.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-3xl border border-white/60">
          <div className="text-6xl mb-4">🛫</div>
          <h2 className="font-display text-xl font-bold text-slate-700 mb-2">No flights yet</h2>
          <p className="text-slate-400 mb-6">
            Every platform switch is a flight. Log yours.
          </p>
          <Link
            href="/flights/new"
            className="inline-block px-7 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF]"
          >
            Log First Flight 🛫
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}
