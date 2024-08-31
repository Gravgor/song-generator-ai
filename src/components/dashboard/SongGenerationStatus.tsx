// app/components/SongGenerationStatus.tsx
'use client';

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { StyledButton } from '../ui/Button';
import { LinearProgress } from '@mui/material';

export default function SongGenerationStatus({ taskId, userId }: { taskId: string, userId: string }) {
  const [status, setStatus] = useState('Processing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      socket.emit('join', userId);
    });

    socket.on('songGenerationProgress', (data) => {
        console.log(data);
      if (data.taskId === taskId) {
        console.log(data);
        setStatus(data.status);
        setProgress((prev) => Math.min(prev + 10, 90));
      }
    });

    socket.on('songGenerationComplete', (data) => {
      if (data.taskId === taskId) {
        setStatus('Completed');
        setProgress(100);
      }
    });

    socket.on('songGenerationFailed', (data) => {
      if (data.taskId === taskId) {
        setStatus('Failed');
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [taskId, userId]);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-background rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Song Generation Status</h2>
      <LinearProgress value={progress} />
      <p className="text-lg mb-4 text-foreground">Status: {status}</p>
      {status === 'Completed' && (
        <StyledButton>View Generated Song</StyledButton>
      )}
    </div>
  );
}