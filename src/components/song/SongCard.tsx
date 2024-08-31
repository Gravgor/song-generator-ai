'use client';

import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';


const SongCardContainer = styled(Card)({
  marginBottom: '1rem',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  height: '195px', // Set a fixed height for all cards
  display: 'flex',
  flexDirection: 'column',
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  overflow: 'hidden', // Hide overflow content
});
const SongCardHeader = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});
const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  gap: '1rem',
  marginTop: 'auto',
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
    clipTags: string;
    createdAt: Date;
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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = song.clipAudioUrl;
    link.download = `${song.clipTitle}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Tags: {song.clipTags}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Created: {new Date(song.createdAt).toLocaleDateString()}
            </Typography>
            {song.isRejected && (
              <Typography variant="body2" color="error" gutterBottom>
                Status: Rejected
              </Typography>
            )}
            <ButtonContainer>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={handlePlayPause}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download
              </Button>
              {!song.isRejected && (
                <Button variant="outlined" color="secondary">
                  Edit
                </Button>
              )}
            </ButtonContainer>
          </Grid>
        </Grid>
      </CardContent>
      <audio ref={audioRef} src={song.clipAudioUrl} onEnded={() => setIsPlaying(false)} />
    </SongCardContainer>
  );
}