"use client";
import { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Button, Container, Box, TextField } from "@mui/material";

const HeroSection = styled(Box)({
  padding: '4rem 0',
  textAlign: 'center',
  color: '#333',
});

const StyledTextField = styled(TextField)({
  marginBottom: '1rem',
  maxWidth: '600px', 
});

const StyledButton = styled(Button)({
  marginTop: '1rem',
});

export default function Hero() {
  const [songIdea, setSongIdea] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSongIdea(event.target.value);
  };

  const handleSubmit = () => {
    window.location.href = `/create-song?idea=${encodeURIComponent(songIdea)}`;
  };

  return (
    <HeroSection>
      <Container maxWidth="md">
        <Typography variant="h2" gutterBottom>
          Create Your Perfect Song with AI
        </Typography>
        <Typography variant="h5" gutterBottom>
          Transform your ideas into lyrics, and let AI generate a song just for you.
        </Typography>
        
        <StyledTextField
          sx={{ mt: 4 }}
          fullWidth
          variant="outlined"
          placeholder="Describe your song idea..."
          value={songIdea}
          onChange={handleInputChange}
        />
        
        <Box>
          <StyledButton
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmit}
          >
            Generate Your Song Now
          </StyledButton>
        </Box>
      </Container>
    </HeroSection>
  );
}
