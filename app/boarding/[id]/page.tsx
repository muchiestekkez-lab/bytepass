import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import BoardingPass from '@/components/flights/BoardingPass';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const flight = await prisma.flight.findUnique({
    where: { id: params.id },
    include: { from: true, to: true, user: { select: { username: true } } },
  });
  if (!flight) return { title: 'Flight not found — BytePass' };
  return {
    title: `${flight.flightNumber} · ${flight.from.name} → ${flight.to.name} — BytePass`,
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
      {/* Back link */}
      <Link
        href="/"
        className="mb-8 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
      >
        ← BytePass
      </Link>

      <BoardingPass flight={flight} />

      <p className="mt-8 text-sm text-slate-400 text-center">
        Screenshot this boarding pass and share it everywhere ✈️
        <br />
        <Link href="/register" className="text-[#7B61FF] font-semibold hover:underline">
          Create your own Internet Passport →
        </Link>
      </p>
    </div>
  );
}
