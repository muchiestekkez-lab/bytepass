import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import GlobalFeed from '@/components/social/GlobalFeed';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Activity Feed — Cloud Trip' };

async function getGlobalFlights() {
  return prisma.flight.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      flightNumber: true,
      reason: true,
      createdAt: true,
      user: { select: { username: true, avatar: true } },
      from: { select: { name: true, slug: true, color: true } },
      to:   { select: { name: true, slug: true, color: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

async function getFollowingFlights(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  const ids = follows.map((f) => f.followingId);
  if (ids.length === 0) return [];

  return prisma.flight.findMany({
    where: { userId: { in: ids } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      flightNumber: true,
      reason: true,
      createdAt: true,
      user: { select: { username: true, avatar: true } },
      from: { select: { name: true, slug: true, color: true } },
      to:   { select: { name: true, slug: true, color: true } },
      _count: { select: { reactions: true, comments: true } },
    },
  });
}

export default async function FeedPage() {
  const auth = await getAuthUser();

  const [globalFlights, followingFlights] = await Promise.all([
    getGlobalFlights(),
    auth ? getFollowingFlights(auth.userId) : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="font-display text-3xl font-black text-slate-800">Activity Feed ✈️</h1>

      {/* Following feed */}
      {auth && (
        <section>
          <h2 className="font-display text-lg font-bold text-slate-700 mb-3">
            Following{' '}
            <span className="text-sm font-normal text-slate-400">
              ({followingFlights.length} recent flights)
            </span>
          </h2>
          {followingFlights.length === 0 ? (
            <div className="bg-white/60 rounded-2xl border border-white/60 px-6 py-8 text-center">
              <p className="text-slate-400 text-sm">Follow some travellers to see their flights here.</p>
            </div>
          ) : (
            <GlobalFeed initialFlights={followingFlights} endpoint="/api/feed/following" />
          )}
        </section>
      )}

      {/* Global feed */}
      <section>
        <h2 className="font-display text-lg font-bold text-slate-700 mb-3">
          🌍 Global Live Feed
        </h2>
        <GlobalFeed initialFlights={globalFlights} endpoint="/api/feed/global" />
      </section>
    </div>
  );
}
