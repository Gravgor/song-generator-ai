// songGenerationServer.js
import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { songGenerationQueue } from './src/websockets/queue.js';
import { processSongGeneration } from './src/websockets/workers/songGenerationWorker.js';

const port = parseInt(process.env.SONG_GEN_PORT || '3001', 10);

const app = express();
const server = createServer(app);
const io = new SocketServer(server);

io.on('connection', (socket) => {
  console.log('A user connected to song generation server');
  
  socket.on('disconnect', () => {
    console.log('User disconnected from song generation server');
  });
});

// Set up song generation queue
songGenerationQueue.process(processSongGeneration);
console.log('Queue processor started');

songGenerationQueue.on('active', (job) => {
  console.log(`Job ${job.id} has started processing`);
});

songGenerationQueue.on('songGenerationComplete', (job, result) => {
  console.log(`Job ${job.id} completed with result:`, result);
});

songGenerationQueue.on('songGenerationFailed', (job, err) => {
  console.error(`Job ${job.id} failed with error:`, err);
});

songGenerationQueue.on('error', (error) => {
  console.error('Queue error:', error);
});

server.listen(port, () => {
  console.log(`> Song Generation Server ready on http://localhost:${port}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export { io };