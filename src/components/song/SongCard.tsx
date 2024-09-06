'use client';

import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useState, useRef } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { colors } from '@/style/style';

const SongCardContainer = styled(Card)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  marginBottom: '1rem',
  overflow: 'hidden',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
});

const StyledCardContent = styled(CardContent)({
  padding: '1.5rem',
});

const SongCardHeader = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  color: '#FFFFFF',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
});

const SongInfo = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.7)',
  marginBottom: '0.5rem',
});

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
});

const ActionButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#FFFFFF',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

const PlayButton = styled(ActionButton)({
  backgroundColor: colors.primary,
  '&:hover': {
    backgroundColor: colors.secondary,
  },
});

const CoverImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
      <StyledCardContent>
        <Grid container spacing={2}>
          <Grid item xs={4} md={3}>
            <CoverImage src={song.clipCoverUrl || '/default-cover.jpg'} alt={song.clipTitle} />
          </Grid>
          <Grid item xs={8} md={9}>
            <SongCardHeader variant="h6">{song.clipTitle}</SongCardHeader>
            <SongInfo variant="body2">
              Tags: {song.clipTags}
            </SongInfo>
            <SongInfo variant="body2">
              Created: {new Date(song.createdAt).toLocaleDateString()}
            </SongInfo>
            {song.isRejected && (
              <SongInfo variant="body2" sx={{ color: 'error.main' }}>
                Status: Rejected
              </SongInfo>
            )}
            <ButtonContainer>
              <PlayButton
                startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={handlePlayPause}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </PlayButton>
              <ActionButton
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download
              </ActionButton>
              {!song.isRejected && (
                <ActionButton startIcon={<EditIcon />}>
                  Edit
                </ActionButton>
              )}
            </ButtonContainer>
          </Grid>
        </Grid>
      </StyledCardContent>
      <audio ref={audioRef} src={song.clipAudioUrl} onEnded={() => setIsPlaying(false)} />
    </SongCardContainer>
  );
}