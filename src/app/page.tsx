'use client';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, IconButton, Tooltip } from "@mui/material";
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';
import { SetStateAction, useState } from "react";
import Hero from "@/components/Hero";

const MainContainer = styled(Box)({
  backgroundColor: '#F1FAEE', // Light grey background for a clean, neutral look
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: '#333333', // Dark text for contrast
});


const FeatureCard = styled(Card)({
  backgroundColor: '#fff', // White card for a clean, modern appearance
  color: '#333', // Dark text for readability
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for subtle depth
});

const Logo = styled('img')({
  height: 50, // Adjust height according to your logo size
  marginRight: 16, // Space between logo and site title
});

const SongListContainer = styled(Container)({
  padding: '2rem 0',
});

const SongItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: '1rem',
  '&:hover': {
    backgroundColor: '#f0f0f0',
  },
});

const SongDetailsTooltip = styled('div')({
  padding: '1rem',
  maxWidth: '300px',
});

const mockSongs = [
  {
    id: 1,
    title: "Dreams of Tomorrow",
    style: "Pop, Upbeat",
    lyrics: "Life is just a journey, Take it step by step...",
  },
  {
    id: 2,
    title: "Echoes in the Rain",
    style: "Rock, Melancholic",
    lyrics: "I hear the echoes, in the pouring rain...",
  },
];

export default function MainPage() {
  const [playingSong, setPlayingSong] = useState(null);

  const handlePlaySong = (song: any) => {
    setPlayingSong(song);
  };

  return (
    <MainContainer>
    <Hero />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Custom Lyrics
                </Typography>
                <Typography>
                  Create and edit song lyrics easily with our AI-powered editor.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  AI Song Generation
                </Typography>
                <Typography>
                  Generate unique songs based on your lyrics and ideas.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Manage Your Creations
                </Typography>
                <Typography>
                  Save and manage your songs, edit them anytime, and share them with the world.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
      
      <SongListContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Recently Generated Songs
        </Typography>
        {mockSongs.map((song) => (
          <SongItem key={song.id}>
            <Box>
              <Tooltip
                title={
                  <SongDetailsTooltip>
                    <Typography variant="body1"><strong>Style:</strong> {song.style}</Typography>
                    <Typography variant="body1"><strong>Lyrics:</strong> {song.lyrics}</Typography>
                  </SongDetailsTooltip>
                }
                arrow
                placement="right"
              >
                <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                  {song.title}
                </Typography>
              </Tooltip>
            </Box>
            <IconButton color="primary" onClick={() => handlePlaySong(song)}>
              <PlayArrow />
            </IconButton>
          </SongItem>
        ))}
      </SongListContainer>

      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; 2024 AI Song Creator. All rights reserved.
        </Typography>
      </Box>
    </MainContainer>
  );
}