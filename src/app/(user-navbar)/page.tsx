"use client";
import { useState } from 'react';
import {Typography, Button, Box, Grid, Card, Container, CardContent, IconButton, Tooltip, CardMedia, keyframes } from "@mui/material";
import {  Memory, DataObject, CloudQueue } from '@mui/icons-material';
import { styled } from '@mui/system';
import Hero from "@/components/ui/Hero";
import MainContainer from "@/components/ui/Containter";
import SongList from "@/components/song/SongList";
import { motion } from 'framer-motion';
import { colors } from '@/style/style';
import Navbar from '@/components/ui/Navbar';


const Section = styled(Box)({
  padding: '4rem 0', // Increased padding for better spacing
  '@media (max-width: 600px)': {
    padding: '3rem 0', // Slightly less padding on mobile
  },
});

const MaxWidthContainer = styled(Container)({
  maxWidth: '1200px', // Set a max-width for better readability on large screens
});

const FeatureSection = styled(Section)({
  backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slight background color for visual separation
});

const SongListSection = styled(Section)({
});

const Footer = styled(Box)({
  padding: '2rem 0',
  backgroundColor: 'rgba(0, 0, 0, 0.1)', // Darker background for footer
});


const AIBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: `linear-gradient(45deg, ${colors.background} 0%, #1a2a4a 100%)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 5%), radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 5%)',
    opacity: 0.5,
  },
});

const FloatingParticle = styled(Box)({
  position: 'absolute',
  width: '4px',
  height: '4px',
  background: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '50%',
  animation: 'float 15s infinite linear',
  '@keyframes float': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(100vw, 100vh)' },
  },
});

const iconPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const FeatureCard = styled(motion.div)({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  height: '100%',
  color: colors.text,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});

const FeatureIcon = styled(Box)({
  fontSize: 50,
  color: colors.primary,
  marginBottom: '1rem',
  animation: `${iconPulse} 2s infinite ease-in-out`,
});

const FeatureTitle = styled(Typography)({
  color: '#FFFFFF',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

const FeatureDescription = styled(Typography)({
  color: 'rgba(255, 255, 255, 0.8)',
});



const SongListContainer = styled(Container)({
  padding: '2rem 0',
});

const AIAssistant = styled(Box)({
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: colors.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
});


export default function MainPage() {
  const [playingSong, setPlayingSong] = useState(null);

  const handlePlaySong = (song: any) => {
    setPlayingSong(song);
    // Add functionality to play song here
  };

  return (
    <MainContainer>
      <AIBackground>
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            sx={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDuration: `${15 + Math.random() * 15}s`,
              animationDelay: `-${Math.random() * 15}s`,
            }}
          />
        ))}
      </AIBackground>

      <Hero />
      <SongListSection>
        <MaxWidthContainer>
          <SongList />
        </MaxWidthContainer>
      </SongListSection>

      <FeatureSection>
        <MaxWidthContainer>
          <Grid container spacing={4}>
            {[
              { icon: Memory, title: "AI-Powered Composition", description: "Our advanced AI algorithms create unique melodies and harmonies tailored to your preferences." },
              { icon: DataObject, title: "Deep Learning Lyrics", description: "Generate meaningful and coherent lyrics using state-of-the-art natural language processing." },
              { icon: CloudQueue, title: "Cloud-Based Creation", description: "Access your AI-generated songs from anywhere, anytime with our secure cloud storage." }
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CardContent sx={{ padding: '2rem' }}>
                    <FeatureIcon as={feature.icon} />
                    <FeatureTitle variant="h5">
                      {feature.title}
                    </FeatureTitle>
                    <FeatureDescription variant="body2">
                      {feature.description}
                    </FeatureDescription>
                  </CardContent>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </MaxWidthContainer>
      </FeatureSection>

      <Footer component="footer">
        <MaxWidthContainer>
          <Typography variant="body2" color={colors.textBlack} align="center">
            &copy; 2024 TuneCraft. All rights reserved.
          </Typography>
        </MaxWidthContainer>
      </Footer>

      <AIAssistant>
        <IconButton color="inherit">
          <Memory />
        </IconButton>
      </AIAssistant>
    </MainContainer>
  );
}