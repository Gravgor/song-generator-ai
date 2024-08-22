"use client";
import { styled } from '@mui/system';
import { Typography, Button, Container, Box } from "@mui/material";

const HeroSection = styled(Box)({
    padding: '4rem 0',
    textAlign: 'center',
    color: '#333', 
  });

export default function Hero() {
    return (
        <HeroSection>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom>
            Create Your Perfect Song with AI
          </Typography>
          <Typography variant="h5" gutterBottom>
            Transform your ideas into lyrics, and let AI generate a song just for you.
          </Typography>
          <Button href='/create-song' variant="contained" color="primary" size="large" sx={{ mt: 4 }}>
            Get Started
          </Button>
        </Container>
      </HeroSection>
    )
}