'use client';
import { AppBar, Toolbar, Typography, Button, Container, Box, Grid, Card, CardContent, IconButton, Tooltip, CardMedia } from "@mui/material";
import { PlayArrow } from '@mui/icons-material';
import { styled } from '@mui/system';
import { SetStateAction, useState } from "react";
import Hero from "@/components/Hero";

// Define the color palette
const colors = {
  primary: '#A8DADC', // Soft Pastel Blue
  secondary: '#FF6F61', // Light Coral
  background: '#F1FAEE', // Off-White
  text: '#333333', // Charcoal Gray
  buttonText: '#FFFFFF', // White
};

// Custom styled components
const MainContainer = styled(Box)({
  background: `linear-gradient(to bottom, #FFFFFF, ${colors.background})`, // Gradient from white to Off-White background
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: colors.text, // Charcoal Gray text
  fontFamily: 'Poppins, Nunito, sans-serif', // Rounded, modern sans-serif fonts
});

const FeatureCard = styled(Card)({
  backgroundColor: '#fff', // White card for a clean, modern appearance
  color: colors.text, // Charcoal Gray text for readability
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Light shadow for subtle depth
  borderRadius: '8px',
});

const SongListContainer = styled(Container)({
  padding: '2rem 0',
});

const SongCard = styled(Card)({
  backgroundColor: '#ffffff', // White background
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  transition: 'transform 0.2s ease-in-out', // Smooth hover effect
  '&:hover': {
    transform: 'scale(1.05)', // Scale up slightly on hover
  },
});

const StyledButton = styled(Button)({
  backgroundColor: colors.primary, // Soft Pastel Blue for buttons
  color: colors.buttonText, // White button text
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: colors.secondary, // Change to Light Coral on hover
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
    image: "https://via.placeholder.com/150", // Placeholder image URL
  },
  {
    id: 2,
    title: "Echoes in the Rain",
    style: "Rock, Melancholic",
    lyrics: "I hear the echoes, in the pouring rain...",
    image: "https://via.placeholder.com/150", // Placeholder image URL
  },
  // Add more mock songs as needed
];

export default function MainPage() {
  const [playingSong, setPlayingSong] = useState(null);

  const handlePlaySong = (song: any) => {
    setPlayingSong(song);
    // Add your song playing logic here
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
                    sx={{ color: colors.primary }} // Soft Pastel Blue for play button
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
