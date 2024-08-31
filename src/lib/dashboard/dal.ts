'use server';
import { verifySession } from "../auth";
import { prisma } from "@/lib/prisma";
import { addSongGenerationJob } from "@/websockets/queue";
import { revalidatePath } from "next/cache";




export async function protectedChooseClip(clipId: string, songGenerationId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }

    try {
        await prisma.clip.update({
            where: { id: clipId },
            data: { isChosen: true }
        });

        await prisma.clip.updateMany({
            where: {
                songGenerationId: songGenerationId,
                id: { not: clipId }
            },
            data: { isRejected: true }
        });

        await prisma.songGeneration.update({
            where: { id: songGenerationId },
            data: { generationProgress: 'completed' }
        });

        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Error choosing clip:', error);
        return { success: false, error: 'Failed to choose clip' };
    }
}



export async function addToQueue(userId: string, taskId: string) {
    addSongGenerationJob(userId, taskId);
}
