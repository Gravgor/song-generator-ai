import { io } from '../../../server.js';
import { prisma } from '../prisma.js';
import { logger } from '../lib/logger.js';
import { revalidatePath } from 'next/cache.js';

export const processSongGeneration = async (job) => {
  const { userId, taskId } = job.data;
  console.log('Starting to process job:', job.id, 'for user:', userId, 'task:', taskId);
  let retries = 0;
  const maxRetries = 60; // 10 minutes (60 * 10 seconds)

  while (retries < maxRetries) {
    try {
      const apiKey = process.env.GOAPI_API_KEY;
      const apiUrl = process.env.GOAPI_URL;

      if (!apiKey || !apiUrl) {
        throw new Error('API key or URL is not configured');
      }

      logger.info(`Fetching task status for ${taskId} from ${apiUrl}`);
      const taskRequest = await fetch(`${apiUrl}/${taskId}`, {
        headers: {
          "X-API-Key": apiKey,
          "Content-Type": "application/json"
        }
      });

      if (!taskRequest.ok) {
        throw new Error(`API request failed with status ${taskRequest.status}`);
      }

      const taskResponse = await taskRequest.json();
      logger.info(`Task ${taskId} status: ${taskResponse.data.status}`);

      if (taskResponse.data.status === "completed") {
        const clips = taskResponse.data.clips;
        logger.info(`Received clips for task ${taskId}:`, clips);

        for (const clipId in clips) {
          const clip = clips[clipId];
          await prisma.clip.create({
            data: {
              clipId: clipId,
              clipVideoUrl: clip.video_url,
              clipAudioUrl: clip.audio_url,
              songGeneration: {
                connect: {
                  id: taskId
                }
              },
              user: {
                connect: {
                  id: userId
                }
              },
              clipCoverUrl: clip.image_url,
              clipTitle: clip.title,
              clipTags: clip.metadata.tags,
            }
          });
        }

        await prisma.songGeneration.update({
          where: { id: taskId },
          data: { generationProgress: "completed" }
        });

        io.to(userId).emit('songGenerationComplete', { taskId });
        revalidatePath('/dashboard');
        logger.info(`Song generation completed for task ${taskId}`);
        return { message: "Clips added successfully" };
      } else if (taskResponse.data.status === "failed") {
        io.to(userId).emit('songGenerationComplete', { taskId });
        logger.error(`Song generation failed for task ${taskId}`);
        throw new Error("Song generation failed");
      } else {
        await prisma.songGeneration.update({
          where: { id: taskId },
          data: { generationProgress: taskResponse.data.status }
        });
        io.to(userId).emit('songGenerationComplete', { taskId, status: taskResponse.data.status });
        retries++;
        logger.info(`Waiting for next retry (${retries}/${maxRetries}) for task ${taskId}`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (error) {
      logger.error(`Error processing task ${taskId}:`, error);
      retries++;
      if (retries >= maxRetries) {
        io.to(userId).emit('songGenerationFailed', { taskId, message: "Song generation timed out" });
        throw new Error("Song generation timed out");
      }
      logger.info(`Waiting for next retry (${retries}/${maxRetries}) for task ${taskId}`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  io.to(userId).emit('songGenerationFailed', { taskId, message: "Song generation timed out" });
  logger.error(`Song generation timed out for task ${taskId}`);
  throw new Error("Song generation timed out");
};