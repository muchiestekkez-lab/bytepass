import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BoardingPass from '@/components/flights/BoardingPass';
import DownloadButton from '@/components/ui/DownloadButton';

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
  const flight = await prisma.flight.findUnique({
    where: { id: params.id },
    include: { from: true, to: true, user: { select: { username: true } } },
  });

  if (!flight) notFound();

  return (
    <div className="min-h-screen animated-bg flex flex-col items-center justify-center p-6">
      <Link
        href="/"
        className="mb-8 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        ← Cloud Trip
      </Link>

      <div id="boarding-pass-card">
        <BoardingPass flight={flight} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <DownloadButton
          targetId="boarding-pass-card"
          filename={`cloudtrip-${flight.flightNumber}.png`}
          label="Download Boarding Pass"
        />
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
