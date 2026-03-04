'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  username: string;
}

export default function Navbar({ username }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm">
      <Link
        href="/dashboard"
        className="font-display text-xl font-black gradient-text bg-gradient-to-r from-[#FF6EC7] via-[#7B61FF] to-[#00D1FF]"
      >
        BytePass ✈️
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href="/flights/new"
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white shadow-sm hover:shadow-md hover:scale-105 transition-all"
        >
          ✈️ Log Flight
        </Link>

        <Link
          href={`/u/${username}`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white/80 transition-all border border-slate-200"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#FF6EC7] to-[#7B61FF] flex items-center justify-center text-white text-xs font-bold">
            {username[0].toUpperCase()}
          </div>
          <span className="hidden sm:inline">@{username}</span>
        </Link>

        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-xl text-sm text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
