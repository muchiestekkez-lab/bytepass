import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calcInternetAge, getCitizenLevel, getUniqueStamps } from '@/lib/utils';
import PassportCover from '@/components/passport/PassportCover';
import FlightCard from '@/components/flights/FlightCard';
import DownloadButton from '@/components/ui/DownloadButton';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'My Passport — Cloud Trip' };

export default async function PassportPage() {
  const auth = await getAuthUser();
  if (!auth) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      flights: {
        include: { from: true, to: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) redirect('/login');

  const totalFlights = user.flights.length;
  const citizenLevel = getCitizenLevel(totalFlights);
  const internetAge = calcInternetAge(user.internetYear);
  const visitedSlugs = getUniqueStamps(user.flights);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-3xl font-black text-slate-800">My Passport 🛂</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <DownloadButton targetId="passport-card" filename={`cloudtrip-passport-${user.username}.png`} label="Download Passport" />
          <Link
            href={`/u/${user.username}`}
            target="_blank"
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white/80 border border-slate-200 text-slate-700 hover:bg-white hover:shadow-md transition-all"
          >
            View Public Profile →
          </Link>
        </div>
      </div>

      {/* Passport booklet — stamps are now INSIDE PassportCover */}
      <div id="passport-card">
        <PassportCover
          username={user.username}
          bio={user.bio}
          internetAge={internetAge}
          citizenLevel={citizenLevel}
          createdAt={user.createdAt}
          totalFlights={totalFlights}
          visitedSlugs={visitedSlugs}
        />
      </div>

      {/* Travel history */}
      <div>
        <h2 className="font-display text-xl font-bold text-slate-800 mb-4">
          Travel History ({totalFlights} flights)
        </h2>

        {user.flights.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-3xl border border-white/60">
            <div className="text-5xl mb-3">🗺️</div>
            <p className="text-slate-500">No flights yet. Your passport is blank.</p>
            <Link
              href="/flights/new"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF]"
            >
              Log your first flight →
            </Link>
          </div>
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
