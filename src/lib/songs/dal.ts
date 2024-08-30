import { getServerAuthSession } from "@/next-auth/next-auth-options";
import { verifySession } from "../auth";
import { prisma } from "@/lib/prisma";


interface SongProgress {
    songTitle: string;
    songIdea: string;
    style: string;
    tone: string;
    vocalStyle: string;
    influences: string;
    lyrics: string;
    step: number;
  }
  


export async function protectedGetSongProgress(userId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const progress = await prisma.songProgress.findFirst({
        where: {
            userId: userId,
        },
    });
    return progress;
}


export async function protectedClearProgress() {
   /*
   const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }*/
    const session = await getServerAuthSession();
    if (!session || !session.user) {
        throw new Error("No session or user found");
    }
    try {
      let userId = session.user.id ?? '';
      
      if (!userId && session.user.email) {
        const user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });
        userId = user?.id ?? '';
      }
  
      if (!userId) {
        throw new Error("User ID not found");
      }
  
      await prisma.songProgress.deleteMany({
        where: {
          userId: userId,
        },
      });
      return { message: "Progress cleared successfully" };
    } catch (error) {
      console.error("Error clearing song progress:", error);
      throw new Error("Failed to clear song progress");
    }
  }


  export async function protectedLoadProgress() {
   /*
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }*/
    const session = await getServerAuthSession();
    if (!session || !session.user) {
        throw new Error("No session or user found");
    }
    try {
      let userId = session.user.id ?? '';
      
      if (!userId && session.user.email) {
        const user = await prisma?.user.findUnique({
          where: {
            email: session.user.email,
          },
        });
        userId = user?.id ?? '';
      }
  
      if (!userId) {
        throw new Error("User ID not found");
      }
  
      const existingProgress = await prisma?.songProgress.findFirst({
        where: {
          userId: userId,
        },
      });
  
      if (existingProgress) {
        return existingProgress;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error loading song progress:", error);
      throw new Error("Failed to load song progress");
    }
  }


  export async function protectedSaveProgress(data: Partial<SongProgress>): Promise<object> {
    /*const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }*/
    const session = await getServerAuthSession();
  
    if (!session || !session.user) {
      return { error: true, message: "No session or user found" };
    }
  
    try {
      // Determine the user ID, fall back to email lookup if ID is undefined
      let userId = session.user.id ?? '';
      
      if (!userId && session.user.email) {
        const user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });
        userId = user?.id ?? '';
      }
  
      if (!userId) {
        throw new Error("User ID not found");
      }
  
      // Check if there is existing progress for this user
      const existingProgress = await prisma.songProgress.findFirst({
        where: {
          userId: userId,
        },
      });
  
      if (existingProgress) {
        // If progress exists, update it
        await prisma.songProgress.update({
          where: {
            id: existingProgress.id,
          },
          data: {
            songTitle: data.songTitle ?? "",
            songIdea: data.songIdea ?? "",
            style: data.style ?? "",
            tone: data.tone ?? "",
            vocalStyle: data.vocalStyle ?? "",
            influences: data.influences ?? "",
            lyrics: data.lyrics ?? "",
            step: data.step ?? 0,
          },
        });
        return { message: "Progress updated successfully" };
      } else {
        // If no progress exists, create a new record
        await prisma.songProgress.create({
          data: {
            userId: userId,
            songTitle: data.songTitle ?? "",
            songIdea: data.songIdea ?? "",
            style: data.style ?? "",
            tone: data.tone ?? "",
            vocalStyle: data.vocalStyle ?? "",
            influences: data.influences ?? "",
            lyrics: data.lyrics ?? "",
            step: data.step ?? 0,
          },
        });
        return { message: "Progress saved successfully" };
      }
    } catch (error) {
      console.error("Error saving song progress:", error);
      throw new Error("Failed to save song progress");
    }
  }
  