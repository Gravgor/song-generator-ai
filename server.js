import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketServer } from 'socket.io';
import { songGenerationQueue } from './src/websockets/queue.js';
import { processSongGeneration } from './src/websockets/workers/songGenerationWorker.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  io = new SocketServer(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  songGenerationQueue.process(processSongGeneration);

  console.log('Queue processor started');
  songGenerationQueue.on('songGenerationComplete', (job) => {
    console.log(`Job ${job.id} has started processing`);
  });

  songGenerationQueue.on('songGenerationComplete', (job, result) => {
    console.log(`Job ${job.id} completed with result:`, result);
  });

  songGenerationQueue.on('songGenerationComplete', (job, err) => {
    console.error(`Job ${job.id} failed with error:`, err);
  });

  songGenerationQueue.on('songGenerationComplete', (error) => {
    console.error('Queue error:', error);
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
  

export { io };