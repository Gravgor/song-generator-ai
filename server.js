import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import next from 'next';
import { songGenerationQueue } from './src/websockets/queue.js';
import { processSongGeneration } from './src/websockets/workers/songGenerationWorker.js';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

let io;

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  const io = new SocketServer(server);

  app.all('*', (req, res) => {
    return nextHandler(req, res);
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  // Set up song generation queue
  songGenerationQueue.process(processSongGeneration);

  console.log('Queue processor started');

  songGenerationQueue.on('active', (job) => {
    console.log(`Job ${job.id} has started processing`);
  });

  songGenerationQueue.on('completed', (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
  });

  songGenerationQueue.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
  });

  songGenerationQueue.on('error', (error) => {
    console.error('Queue error:', error);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

export { io };