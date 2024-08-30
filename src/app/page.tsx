'use client';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Card, Container, CardContent, IconButton, Tooltip, CardMedia } from "@mui/material";
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useState } from "react";
import Hero from "@/components/ui/Hero";
import MainContainer from "@/components/ui/Containter";
import { colors } from "@/style/style";
import SongList from "@/components/song/SongList";

const FeatureCard = styled(Card)({
  backgroundColor: '#fff',
  color: colors.text,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const SongListContainer = styled(Container)({
  padding: '1rem 0',
});

const SongCard = styled(Card)({
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const SongCardContent = styled(CardContent)({
  flex: 1,
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const StyledButton = styled(Button)({
  backgroundColor: colors.primary,
  color: colors.buttonText,
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: colors.secondary,
  },
});

const SongDetailsTooltip = styled('div')({
  padding: '1rem',
  maxWidth: '300px',
});

export default function MainPage() {
  const [playingSong, setPlayingSong] = useState(null);

  const handlePlaySong = (song: any) => {
    setPlayingSong(song);
    // Add functionality to play song here
  };

  return (
    <MainContainer>
      <Hero />

      <SongListContainer maxWidth="lg">
        <SongList />
      </SongListContainer>

      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; 2024 AI Song Creator. All rights reserved.
        </Typography>
      </Box>
    </MainContainer>
  );
}
