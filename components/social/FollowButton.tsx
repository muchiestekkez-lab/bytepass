'use client';

import { useState } from 'react';

interface FollowButtonProps {
  username: string;
  initialFollowing: boolean;
}

export default function FollowButton({ username, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        const data = await res.json();
        setFollowing(data.following);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-60 ${
        following
          ? 'bg-white border border-slate-200 text-slate-700 hover:border-red-300 hover:text-red-500'
          : 'bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-md hover:scale-105'
      }`}
    >
      {loading ? '...' : following ? 'Following ✓' : '+ Follow'}
    </button>
  );
}
