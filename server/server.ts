import { startSocketServer } from './socketServer.js';

async function startServers() {
  try {
    await startSocketServer();
  } catch (err) {
    console.error('Error starting servers:', err);
    process.exit(1);
  }
}

startServers();