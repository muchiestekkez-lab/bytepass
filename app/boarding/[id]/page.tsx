import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import BoardingPass from '@/components/flights/BoardingPass';
import DownloadButton from '@/components/ui/DownloadButton';
import FlightCardReactions from '@/components/social/FlightCardReactions';
import CommentSection from '@/components/social/CommentSection';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: { id: params.id },
    include: { from: true, to: true, user: { select: { username: true } } },
  });
  if (!flight) return { title: 'Flight not found — Cloud Trip' };
  return {
    title: `${flight.flightNumber} · ${flight.from.name} → ${flight.to.name} — Cloud Trip`,
    description: `@${flight.user.username} flew from ${flight.from.name} to ${flight.to.name}`,
  };
}

export default async function BoardingPassPage({ params }: { params: { id: string } }) {
  const [flight, auth] = await Promise.all([
    prisma.flight.findUnique({
      where: { id: params.id },
      include: {
        from: true,
        to: true,
        user: { select: { username: true } },
        reactions: { select: { emoji: true, userId: true } },
        comments: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true, body: true, createdAt: true,
            user: { select: { username: true, avatar: true } },
          },
        },
      },
    }),
    getAuthUser(),
  ]);

  if (!flight) notFound();

  // aggregate reactions for the client component
  const reactionCounts: Record<string, number> = {};
  const myReactions: string[] = [];
  for (const r of flight.reactions) {
    reactionCounts[r.emoji] = (reactionCounts[r.emoji] ?? 0) + 1;
    if (auth && r.userId === auth.userId) myReactions.push(r.emoji);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const comments = flight.comments.map((c: any) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  // get viewer's username for comment ownership
  let currentUsername: string | undefined;
  if (auth) {
    const viewer = await prisma.user.findUnique({ where: { id: auth.userId }, select: { username: true } });
    currentUsername = viewer?.username;
  }

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-6">
      <Link
        href={auth ? '/dashboard' : '/'}
        className="mb-8 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        ← Cloud Trip
      </Link>

      <div id="boarding-pass-card">
        <BoardingPass flight={flight} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 w-full max-w-sm">
        <DownloadButton
          targetId="boarding-pass-card"
          filename={`cloudtrip-${flight.flightNumber}.png`}
          label="Download Boarding Pass"
        />

        {/* Reactions */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-widest">Reactions</p>
          <FlightCardReactions
            flightId={flight.id}
            initialCounts={reactionCounts}
            initialMine={myReactions}
          />
        </div>

        {/* Comments */}
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 px-5 py-4">
          <CommentSection
            flightId={flight.id}
            initialComments={comments}
            currentUsername={currentUsername}
          />
        </div>

        <p className="text-sm text-slate-400 text-center">
          Share it everywhere ✈️ ·{' '}
          <Link href="/register" className="text-[#7B61FF] font-semibold hover:underline">
            Create your own Internet Passport →
          </Link>
        </p>
      </div>
    </div>
  );
}
