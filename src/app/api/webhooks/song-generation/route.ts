import { addSongGenerationJob } from "../../../../../server/websockets/queue";

export async function POST(req: Request, res: Response) {
    const { userId, taskId } = await req.json();

    if (!userId || !taskId) {
        return new Response('Missing userId or taskId', { status: 400 });
    }

    try {
        const job = await addSongGenerationJob(userId, taskId);
        return new Response('Song generation job added', { status: 200 });
    } catch (error) {
        console.error('Error adding song generation job:', error);
        return new Response('Failed to add song generation job', { status: 500 });
    }
}