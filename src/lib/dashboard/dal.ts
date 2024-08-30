import { getServerAuthSession } from "@/next-auth/next-auth-options";
import { verifySession } from "../auth";

import { revalidatePath } from "next/cache";
import { protectedGetSongProgress } from "../songs/dal";
import { protectedGetLatestPayment } from "../stripe/dal";


export async function protectedHandleSongGeneration() {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const session = await getServerAuthSession();
    if (!session) {
        throw new Error("No session found");
    }
    if (!session.user.id) {
        const findUser = await prisma?.user.findUnique({
            where: {
                email: session.user.email!,
            },
        })
        if (!findUser) {
            throw new Error("User not found");
        }
        session.user.id = findUser.id;
    }
    let userId = session.user.id ?? '';
    const payment = await protectedGetLatestPayment(userId);
    if (!payment.success) {
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
                "prompt": `${data.lyrics}
            `,
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
    })
    const response = await request.json()
    const taskID = response.data.task_id
    setTimeout(async () => {
        await protectedGetTask(taskID, userId)
    }, 10000)
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
    console.log(taskResponse)
    if (taskResponse.data.status === "completed") {
        const clips = taskResponse.data.clips;
        for (const clipId in clips) {
            const clip = clips[clipId as keyof typeof clips];
            await prisma?.clip.create({
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
        await prisma?.songGeneration.update({
            where: { id: taskID },
            data: { generationProgress: "completed" }
        });

        return { message: "Clips added successfully" };
    } else if (taskResponse.data.status === "failed") {
        return { error: true, message: "Song generation failed" };
    } else if (taskResponse.data.status === "processing") {
        const existingGeneration = await prisma?.songGeneration.findUnique({
            where: { id: taskID }
        });
        if (!existingGeneration) {
            await prisma?.songGeneration.create({
                data: {
                    id: taskID,
                    userId,
                    generationProgress: taskResponse.data.status,
                    taskID,
                }
            });
        } else {
            await prisma?.songGeneration.update({
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



export async function protectedChooseClip(clipId: string, songGenerationId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }

    try {
        await prisma?.clip.update({
            where: { id: clipId },
            data: { isChosen: true }
        });

        await prisma?.clip.updateMany({
            where: {
                songGenerationId: songGenerationId,
                id: { not: clipId }
            },
            data: { isRejected: true }
        });

        await prisma?.songGeneration.update({
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

