import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a unique flight number like BP-2026-4821 */
export function generateFlightNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CT-${year}-${rand}`;
}

/** Calculate internet age from the year the user started */
export function calcInternetAge(internetYear: number): number {
  return new Date().getFullYear() - internetYear;
}

/** Get citizen level info based on total flights */
export function getCitizenLevel(totalFlights: number): {
  title: string;
  emoji: string;
  color: string;
  next: number | null;
} {
  if (totalFlights >= 50)
    return { title: 'Internet Legend', emoji: '🌌', color: 'from-yellow-400 to-orange-500', next: null };
  if (totalFlights >= 30)
    return { title: 'Byte Captain', emoji: '🚀', color: 'from-violet-500 to-purple-600', next: 50 };
  if (totalFlights >= 15)
    return { title: 'Meme Pilot', emoji: '✈️', color: 'from-cyan-400 to-blue-500', next: 30 };
  if (totalFlights >= 5)
    return { title: 'Digital Nomad', emoji: '🌍', color: 'from-green-400 to-teal-500', next: 15 };
  if (totalFlights >= 1)
    return { title: 'Scroll Rookie', emoji: '📜', color: 'from-pink-400 to-rose-500', next: 5 };
  return { title: 'Explorer', emoji: '🔭', color: 'from-slate-400 to-gray-500', next: 1 };
}

/** Format a date nicely */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Get unique platforms visited from a list of flights */
export function getUniqueStamps(
  flights: { from: { slug: string }; to: { slug: string } }[]
): Set<string> {
  const slugs = new Set<string>();
  for (const f of flights) {
    slugs.add(f.from.slug);
    slugs.add(f.to.slug);
  }
  return slugs;
}
