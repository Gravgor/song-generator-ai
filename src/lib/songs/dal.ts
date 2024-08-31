'use server'
import { getServerAuthSession } from "@/lib/auth";
import { verifySession } from "../auth";
import { prisma } from "@/lib/prisma";
import { protectedGetLatestPayment } from "../stripe/dal";
import { addSongGenerationJob } from "../../websockets/queue";


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
  
      const existingProgress = await prisma.songProgress.findFirst({
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
  


  export async function protectedHandleSongGeneration() {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const session = await getServerAuthSession();
    if (!session || !session.user.id) {
        throw new Error("No valid session found");
    }
    
    const userId = session.user.id;
    const payment = await protectedGetLatestPayment(userId);
    if(!payment) {
        throw new Error("No payment found");
    }
    
    const data = await protectedGetSongProgress(userId);
    if (!data) {
        throw new Error("No song data found");
    }
    
    const apiKey = process.env.GOAPI_API_KEY;
    const request = await fetch(`${process.env.GOAPI_URL}`, {
        method: "POST",
        body: JSON.stringify({
            "custom_mode": true,
            "mv": "chirp-v3-5",
            "input": {
                "prompt": data.lyrics,
                "title": data.songTitle,
                "tags": `${data.style},${data.tone},${data.vocalStyle}`,
                "continue_at": 0,
                "continue_clip_id": ""
            }
        }),
        headers: {
            "X-API-Key": `${apiKey}`,
            "Content-Type": "application/json"
        }
    });
    
    const response = await request.json();
    const taskId = response.data.task_id;
    
    await prisma.songGeneration.create({
        data: {
            id: taskId,
            userId,
            generationProgress: 'processing',
            taskID: taskId,
        }
    });
    
    try {
      const jobResult = await addSongGenerationJob(userId, taskId);
      console.log('Job added to queue:', jobResult);
    } catch (error) {
      console.error('Error adding job to queue:', error);
    }
    
    return { taskId };
}

export async function protectedGetTask(taskID: string, userId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const apiKey = process.env.GOAPI_API_KEY;
    const taskRequest = await fetch(`${process.env.GOAPI_URL}/${taskID}`, {
        headers: {
            "X-API-Key": `${apiKey}`,
            "Content-Type": "application/json"
        }
    })
    const taskResponse = await taskRequest.json()
    if (taskResponse.data.status === "completed") {
        const clips = taskResponse.data.clips;
        for (const clipId in clips) {
            const clip = clips[clipId as keyof typeof clips];
            await prisma.clip.create({
                data: {
                    userId: userId,
                    clipId: clipId,
                    clipVideoUrl: clip.video_url,
                    clipAudioUrl: clip.audio_url,
                    songGenerationId: taskID,
                    clipCoverUrl: clip.image_url,
                    clipTitle: clip.title,
                    clipTags: clip.metadata.tags,
                }
            });
        }
        await prisma.songGeneration.update({
            where: { id: taskID },
            data: { generationProgress: "completed" }
        });

        return { message: "Clips added successfully" };
    } else if (taskResponse.data.status === "failed") {
        return { error: true, message: "Song generation failed" };
    } else if (taskResponse.data.status === "processing") {
        const existingGeneration = await prisma.songGeneration.findUnique({
            where: { id: taskID }
        });
        if (!existingGeneration) {
            await prisma.songGeneration.create({
                data: {
                    id: taskID,
                    userId,
                    generationProgress: taskResponse.data.status,
                    taskID,
                }
            });
        } else {
            await prisma.songGeneration.update({
                where: { id: taskID },
                data: { generationProgress: taskResponse.data.status }
            });
        }
        setTimeout(async () => {
            await protectedGetTask(taskID, userId);
        }, 10000);

        return { message: "Song generation in progress" };
    } else {
        setTimeout(async () => {
            await protectedGetTask(taskID, userId);
        }, 10000);
        return { message: "Waiting for song generation to start" };
    }
}
