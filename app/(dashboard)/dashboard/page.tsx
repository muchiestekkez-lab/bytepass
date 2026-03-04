import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getCitizenLevel, calcInternetAge, formatDate, getUniqueStamps } from '@/lib/utils';
import StatsRow from '@/components/analytics/StatsRow';
import CitizenBadge from '@/components/analytics/CitizenBadge';
import FlightCard from '@/components/flights/FlightCard';
import Card from '@/components/ui/Card';

export const metadata = { title: 'Dashboard — BytePass' };

export default async function DashboardPage() {
  const auth = await getAuthUser();
  if (!auth) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      flights: {
        include: { from: true, to: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user) redirect('/login');

  const totalFlights = await prisma.flight.count({ where: { userId: user.id } });
  const citizenLevel = getCitizenLevel(totalFlights);
  const internetAge = calcInternetAge(user.internetYear);
  const stampCount = getUniqueStamps(user.flights).size;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome banner */}
      <Card className="bg-gradient-to-r from-[#FF6EC7]/10 via-[#7B61FF]/10 to-[#00D1FF]/10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-slate-500 text-sm font-medium">Welcome back,</p>
            <h1 className="font-display text-3xl font-black text-slate-800">
              @{user.username} {citizenLevel.emoji}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Internet age: <strong>{internetAge} years</strong> · Member since{' '}
              {formatDate(user.createdAt)}
            </p>
          </div>
          <CitizenBadge totalFlights={totalFlights} />
        </div>
      </Card>

      {/* Stats */}
      <StatsRow totalFlights={totalFlights} stampCount={stampCount} internetAge={internetAge} />

      {/* Quick action */}
      <Card className="border-dashed border-2 border-[#7B61FF]/30 bg-[#7B61FF]/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-800">Log a new flight ✈️</h2>
            <p className="text-slate-500 text-sm">Where are you headed on the internet today?</p>
          </div>
          <Link
            href="/flights/new"
            className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            Log Flight →
          </Link>
        </div>
      </Card>

      {/* Recent flights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-slate-800">Recent Flights</h2>
          <Link href="/flights" className="text-sm text-[#7B61FF] font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {user.flights.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-slate-500 font-medium">No flights yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              Log your first flight to earn your Scroll Rookie badge!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {user.flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
