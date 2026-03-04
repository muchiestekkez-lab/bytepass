import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  return (
    <div className="min-h-screen animated-bg">
      <Navbar username={user.username} />
      <div className="flex">
        <Sidebar />
        {/* pb-24 ensures content isn't hidden behind the mobile bottom nav */}
        <main className="flex-1 p-4 md:p-8 max-w-5xl pb-24 md:pb-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
