import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { songGenerationQueue } from './websockets/queue.js';
import { processSongGeneration } from './websockets/workers/songGenerationWorker.js';

const socketPort = parseInt(process.env.SOCKET_PORT || '3001', 10);
const nextPort = parseInt(process.env.PORT || '3000', 10);

export let io: SocketServer;

export function startSocketServer() {
  const socketServer = createServer();
  io = new SocketServer(socketServer, {
    cors: {
      origin: `http://localhost:${nextPort}`,
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected to song generation server');

    socket.on('disconnect', () => {
      console.log('A user disconnected from song generation server');
    });
  });

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

  socketServer.listen(socketPort, () => {
    console.log(`> Socket.IO server ready on http://localhost:${socketPort}`);
  });
}