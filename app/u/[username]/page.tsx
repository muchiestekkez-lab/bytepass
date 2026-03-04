import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { calcInternetAge, getCitizenLevel, getUniqueStamps } from '@/lib/utils';
import PassportCover from '@/components/passport/PassportCover';
import FlightCard from '@/components/flights/FlightCard';
import FollowButton from '@/components/social/FollowButton';

export async function generateMetadata({ params }: { params: { username: string } }) {
  return {
    title: `@${params.username}'s Passport — Cloud Trip`,
    description: `Check out @${params.username}'s Internet Passport on Cloud Trip.`,
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const [user, auth] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        bio: true,
        avatar: true,
        internetYear: true,
        passportColor: true,
        createdAt: true,
        flights: {
          include: { from: true, to: true },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { followers: true, following: true } },
      },
    }),
    getAuthUser(),
  ]);

  if (!user) notFound();

  // Check if current viewer follows this user
  let isFollowing = false;
  if (auth && auth.userId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: auth.userId, followingId: user.id } },
    });
    isFollowing = !!follow;
  }

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
        {/* Follow header */}
        {auth && auth.userId !== user.id && (
          <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/60">
            <div className="flex items-center gap-5 text-sm text-slate-600">
              <span><strong className="text-slate-800">{user._count.followers}</strong> followers</span>
              <span><strong className="text-slate-800">{user._count.following}</strong> following</span>
            </div>
            <FollowButton username={user.username} initialFollowing={isFollowing} />
          </div>
        )}

        {/* Passport — stamps are integrated inside */}
        <PassportCover
          username={user.username}
          bio={user.bio}
          avatar={user.avatar}
          internetAge={internetAge}
          citizenLevel={citizenLevel}
          createdAt={user.createdAt}
          totalFlights={totalFlights}
          visitedSlugs={visitedSlugs}
          passportColor={user.passportColor}
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
