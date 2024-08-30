import UserDashboard from '@/components/dashboard/UserDashboard';
import { prisma } from '@/lib/prisma';
import { getServerAuthSession } from "@/lib/auth";
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
      SongGeneration: {
        include: {
          clips: true
        },
        where: {
          generationProgress: 'completed'
        }
      },
      Clips: {
        where: {
          isChosen: true
        }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const completedSongs = user.Clips;
  const generatedSongs = user.SongGeneration;
  const rejectedSongs = await prisma.clip.findMany({
    where: {
      userId: user.id,
      isRejected: true
    }
  });

  // Fetch songs that are still generating
  const generatingSongs = await prisma.songGeneration.findMany({
    where: {
      userId: user.id,
      generationProgress: {
        not: 'completed'
      }
    }
  });

  return (
    <UserDashboard 
      completedSongs={completedSongs} 
      generatedSongs={generatedSongs}
      rejectedSongs={rejectedSongs}
      generatingSongs={generatingSongs}
    />
  );
}