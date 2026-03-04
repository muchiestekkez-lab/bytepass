'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard',   label: 'Home',      emoji: '🏠' },
  { href: '/passport',    label: 'Passport',  emoji: '🛂' },
  { href: '/flights/new', label: 'Log',       emoji: '🛫' },
  { href: '/feed',        label: 'Feed',      emoji: '🌍' },
  { href: '/settings',    label: 'Settings',  emoji: '⚙️' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-200/60 shadow-lg"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-stretch">
        {links.map(({ href, label, emoji }) => {
          const active =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-center transition-colors',
                active ? 'text-[#7B61FF]' : 'text-slate-400 active:text-slate-700'
              )}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF]" />
              )}
              <span className="text-xl leading-none">{emoji}</span>
              <span className={cn('text-[10px] font-semibold leading-none', active ? 'text-[#7B61FF]' : 'text-slate-400')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
