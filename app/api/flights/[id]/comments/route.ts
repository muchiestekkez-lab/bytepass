import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** GET /api/flights/[id]/comments — list comments for a flight */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const comments = await prisma.comment.findMany({
    where: { flightId: params.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      body: true,
      createdAt: true,
      user: { select: { username: true, avatar: true } },
    },
  });

  return NextResponse.json(comments);
}

/** POST /api/flights/[id]/comments — add a comment { body } */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { body } = await req.json();
  if (!body || typeof body !== 'string' || body.trim().length === 0) {
    return NextResponse.json({ error: 'Comment body required' }, { status: 400 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: body.trim().slice(0, 500),
      userId: auth.userId,
      flightId: params.id,
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      user: { select: { username: true, avatar: true } },
    },
  });

  return NextResponse.json(comment);
}

/** DELETE /api/flights/[id]/comments?commentId=xxx — delete own comment */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const commentId = searchParams.get('commentId');
  if (!commentId) return NextResponse.json({ error: 'commentId required' }, { status: 400 });

  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment || comment.userId !== auth.userId) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
  }

  await prisma.comment.delete({ where: { id: commentId } });
  return NextResponse.json({ ok: true });
}
