'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface CommentData {
  id: string;
  body: string;
  createdAt: string;
  user: { username: string; avatar: string | null };
}

interface CommentSectionProps {
  flightId: string;
  initialComments: CommentData[];
  currentUsername?: string; // to show delete btn on own comments
}

export default function CommentSection({ flightId, initialComments, currentUsername }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/flights/${flightId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setBody('');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(id: string) {
    const res = await fetch(`/api/flights/${flightId}/comments?commentId=${id}`, { method: 'DELETE' });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== id));
  }

  const count = comments.length;

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
      >
        💬 {count} comment{count !== 1 ? 's' : ''} {open ? '▲' : '▼'}
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments.length === 0 && (
            <p className="text-xs text-slate-400 italic">No comments yet — be first!</p>
          )}

          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              {/* avatar */}
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg,#FF6EC7,#7B61FF)' }}
              >
                {c.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.user.avatar} alt={c.user.username} className="w-full h-full object-cover" />
                ) : (
                  c.user.username[0].toUpperCase()
                )}
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-700">@{c.user.username}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(new Date(c.createdAt))}</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">{c.body}</p>
                {currentUsername === c.user.username && (
                  <button
                    onClick={() => deleteComment(c.id)}
                    className="text-[10px] text-red-400 hover:text-red-600 mt-1"
                  >
                    delete
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* comment input */}
          {currentUsername ? (
            <form onSubmit={submit} className="flex gap-2 mt-2">
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add a comment…"
                maxLength={500}
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <button
                type="submit"
                disabled={submitting || !body.trim()}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white disabled:opacity-50"
              >
                Post
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400">
              <a href="/login" className="underline">Log in</a> to comment
            </p>
          )}
        </div>
      )}
    </div>
  );
}
