'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { href: '/passport', label: 'My Passport', emoji: '🛂' },
  { href: '/feed', label: 'Activity Feed', emoji: '🌍' },
  { href: '/flights', label: 'Flights', emoji: '✈️' },
  { href: '/flights/new', label: 'Log Flight', emoji: '🛫' },
  { href: '/settings', label: 'Settings', emoji: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-52 min-h-screen pt-6 px-3 border-r border-white/40 bg-white/20 backdrop-blur-sm flex-shrink-0">
      <nav className="space-y-1">
        {links.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150',
                active
                  ? 'bg-gradient-to-r from-[#FF6EC7]/20 to-[#7B61FF]/20 text-[#7B61FF] shadow-sm'
                  : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
              )}
            >
              <span className="text-base">{emoji}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
