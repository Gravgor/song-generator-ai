import Queue from 'bull';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';

dotenv.config();
const redisUrl = process.env.REDIS_URL || 'localhost:6379';



const createRedisClient = () => {
  return new Redis(redisUrl, {
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  });
};

export const songGenerationQueue = new Queue('songGeneration', {
  createClient: (type) => {
    switch (type) {
      case 'client':
        return createRedisClient();
      case 'subscriber':
        return createRedisClient();
      case 'bclient':
        return createRedisClient();
      default:
        return createRedisClient();
    }
  },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  }
});

songGenerationQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

export const addSongGenerationJob = async (userId, taskId) => {
  try {
    const job = await songGenerationQueue.add({ userId, taskId });
    console.log(`Job added to queue: ${job.id}`);
    return job;
  } catch (error) {
    console.error('Error adding job to queue:', error);
    throw error;
  }
};