'use client';

import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const SongCardContainer = styled(Card)({
  marginBottom: '1rem',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const SongCardHeader = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

const SongCardButtons = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
});

const CoverImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
});

interface SongCardProps {
  song: {
    id: string;
    clipTitle: string;
    clipAudioUrl: string;
    clipCoverUrl: string;
    isRejected?: boolean;
  };
}

export default function SongCard({ song }: SongCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <SongCardContainer>
      <CardContent>
        <Grid container spacing={2}>
          {/* Left side: Cover Image */}
          <Grid item xs={4} md={3}>
            <CoverImage src={song.clipCoverUrl || '/default-cover.jpg'} alt={song.clipTitle} />
          </Grid>
          
          {/* Right side: Song Info */}
          <Grid item xs={8} md={9}>
            <SongCardHeader>{song.clipTitle}</SongCardHeader>
            <SongCardButtons>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={handlePlayPause}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              {!song.isRejected && (
                <Button variant="outlined" color="secondary">
                  Edit
                </Button>
              )}
            </SongCardButtons>
          </Grid>
        </Grid>
      </CardContent>
      <audio ref={audioRef} src={song.clipAudioUrl} onEnded={() => setIsPlaying(false)} />
    </SongCardContainer>
  );
}