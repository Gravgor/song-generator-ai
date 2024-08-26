
import { prisma } from '@/lib/prisma';
import UserDashboard from '@/components/UserDashboard';
import { getServerAuthSession } from '@/next-auth/next-auth-options';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const songs = await prisma.songs.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return <UserDashboard songs={songs} />;
}
