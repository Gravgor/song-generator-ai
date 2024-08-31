import { addSongGenerationJob } from '../src/websockets/queue.js'

async function testAddJob() {
  try {
    const userId = 'testUser123';
    const taskId = 'testTask456';
    const job = await addSongGenerationJob(userId, taskId);
    console.log(`Test job added: ${job.id}`);
  } catch (error) {
    console.error('Error adding test job:', error);
  }
}

testAddJob();