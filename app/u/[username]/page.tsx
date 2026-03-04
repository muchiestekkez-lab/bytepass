import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { calcInternetAge, getCitizenLevel, getUniqueStamps } from '@/lib/utils';
import PassportCover from '@/components/passport/PassportCover';
import FlightCard from '@/components/flights/FlightCard';

export async function generateMetadata({ params }: { params: { username: string } }) {
  return {
    title: `@${params.username}'s Passport — Cloud Trip`,
    description: `Check out @${params.username}'s Internet Passport on Cloud Trip.`,
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      bio: true,
      internetYear: true,
      createdAt: true,
      flights: {
        include: { from: true, to: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!user) notFound();

  const totalFlights = user.flights.length;
  const citizenLevel = getCitizenLevel(totalFlights);
  const internetAge = calcInternetAge(user.internetYear);
  const visitedSlugs = getUniqueStamps(user.flights);

  return (
    <div className="min-h-screen animated-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto">
        <Link
          href="/"
          className="font-display text-xl font-black gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]"
        >
          Cloud Trip ☁️✈️
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-md hover:scale-105 transition-all"
        >
          Get My Passport
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Passport — stamps are integrated inside */}
        <PassportCover
          username={user.username}
          bio={user.bio}
          internetAge={internetAge}
          citizenLevel={citizenLevel}
          createdAt={user.createdAt}
          totalFlights={totalFlights}
          visitedSlugs={visitedSlugs}
        />

        {/* Share button */}
        <div className="flex justify-center">
          <a
            href={`https://twitter.com/intent/tweet?text=Check%20out%20my%20Internet%20Passport%20on%20Cloud%20Trip%20%E2%9C%88%EF%B8%8F&url=https://bytepass-app.vercel.app/u/${user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-md hover:scale-105 transition-all"
          >
            Share on Twitter/X 🐦
          </a>
        </div>

        {/* Travel history */}
        <div>
          <h2 className="font-display text-xl font-bold text-slate-800 mb-4">
            Travel History ({totalFlights} flights)
          </h2>
          {user.flights.length === 0 ? (
            <div className="text-center py-12 bg-white/60 rounded-3xl border border-white/60">
              <p className="text-slate-400">No flights logged yet.</p>
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
    </div>
  );
}
