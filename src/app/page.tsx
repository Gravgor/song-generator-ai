'use client';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Card, Container, CardContent, IconButton, Tooltip, CardMedia } from "@mui/material";
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';
import { SetStateAction, useState } from "react";
import Hero from "@/components/Hero";
import MainContainer from "@/components/Containter";
import { colors } from "@/style/style";



const FeatureCard = styled(Card)({
  backgroundColor: '#fff', 
  color: colors.text,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  borderRadius: '8px',
});

const SongListContainer = styled(Container)({
  padding: '2rem 0',
});

const SongCard = styled(Card)({
  backgroundColor: '#ffffff', 
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  transition: 'transform 0.2s ease-in-out', 
  '&:hover': {
    transform: 'scale(1.05)', 
  },
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

const mockSongs = [
  {
    id: 1,
    title: "Dreams of Tomorrow",
    style: "Pop, Upbeat",
    lyrics: "Life is just a journey, Take it step by step...",
    image: "https://via.placeholder.com/150", 
  },
  {
    id: 2,
    title: "Echoes in the Rain",
    style: "Rock, Melancholic",
    lyrics: "I hear the echoes, in the pouring rain...",
    image: "https://via.placeholder.com/150",
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

      <SongListContainer maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Recently Generated Songs
        </Typography>
        <Grid container spacing={4}>
          {mockSongs.map((song) => (
            <Grid item xs={12} sm={6} md={4} key={song.id}>
              <SongCard>
                <CardMedia
                  component="img"
                  height="150"
                  image={song.image}
                  alt={song.title}
                />
                <CardContent>
                  <Tooltip
                    title={
                      <SongDetailsTooltip>
                        <Typography variant="body1"><strong>Style:</strong> {song.style}</Typography>
                        <Typography variant="body1"><strong>Lyrics:</strong> {song.lyrics}</Typography>
                      </SongDetailsTooltip>
                    }
                    arrow
                    placement="top"
                  >
                    <Typography variant="h6" sx={{ cursor: 'pointer' }}>
                      {song.title}
                    </Typography>
                  </Tooltip>
                </CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handlePlaySong(song)}
                    sx={{ color: colors.primary }} 
                  >
                    <PlayArrow />
                  </IconButton>
                </Box>
              </SongCard>
            </Grid>
          ))}
        </Grid>
      </SongListContainer>

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

      <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
        <Typography variant="body2">
          &copy; 2024 AI Song Creator. All rights reserved.
        </Typography>
      </Box>
    </MainContainer>
  );
}
