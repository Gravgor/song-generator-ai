
import { prisma } from '@/lib/prisma';
import UserDashboard from '@/components/UserDashboard';
import { getServerAuthSession } from '@/next-auth/next-auth-options';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    include: {
      userSongs: true,
    }
  });

  return <UserDashboard songs={user?.userSongs ?? []} />;
}
