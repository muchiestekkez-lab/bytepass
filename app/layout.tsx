import type { Metadata } from 'next';
import { Syne, Inter } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Cloud Trip — Stamp Your Internet.',
  description:
    'Create your Internet Passport. Log flights between social platforms. Collect stamps. Share your digital journey.',
  openGraph: {
    title: 'Cloud Trip — Stamp Your Internet.',
    description: 'Your Internet Passport. Log flights. Collect stamps.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
