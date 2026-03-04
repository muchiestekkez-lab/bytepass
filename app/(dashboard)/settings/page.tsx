import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SettingsForm from '@/components/settings/SettingsForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Settings — Cloud Trip' };

export default async function SettingsPage() {
  const auth = await getAuthUser();
  if (!auth) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { internetYear: true, bio: true, username: true, avatar: true, passportColor: true },
  });
  if (!user) redirect('/login');

  return (
    <div className="max-w-xl space-y-6 animate-fade-in">
      <h1 className="font-display text-3xl font-black text-slate-800">Settings ⚙️</h1>
      <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-card">
        <SettingsForm
          username={user.username}
          currentInternetYear={user.internetYear}
          currentBio={user.bio ?? ''}
          currentAvatar={user.avatar ?? null}
          currentPassportColor={user.passportColor}
        />
      </div>
    </div>
  );
}
