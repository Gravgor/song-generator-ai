"use client";

import { useState } from "react";
import { Container, Box, TextField, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { styled } from '@mui/system';

const colors = {
  primary: '#A8DADC', // Soft Pastel Blue
  secondary: '#FF6F61', // Light Coral
  background: '#F1FAEE', // Off-White
  text: '#333333', // Charcoal Gray
  buttonText: '#FFFFFF', // White
};

const MainContainer = styled(Box)({
  background: `linear-gradient(to bottom, #FFFFFF, ${colors.background})`, // Gradient background
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  color: colors.text, // Charcoal Gray text
  fontFamily: 'Poppins, Nunito, sans-serif', // Rounded, modern sans-serif fonts
});

const SongIdeaCard = styled(Card)({
  backgroundColor: '#fff', // White background
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
});

const AIResponseCard = styled(Card)({
  backgroundColor: '#fff', 
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
});

const PaymentSection = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '2rem',
  marginTop: '2rem',
});

const StyledButton = styled(Button)({
  backgroundColor: colors.primary, // Soft Pastel Blue
  color: colors.buttonText, // White text
  '&:hover': {
    backgroundColor: colors.secondary, // Light Coral on hover
  },
  fontFamily: 'Poppins, Nunito, sans-serif',
});

export default function SongCreationPage() {
  const [songIdea, setSongIdea] = useState("");
  const [aiSuggestions, setAISuggestions] = useState(null);
  const [finalizedSong, setFinalizedSong] = useState({ lyrics: "", style: "" });

  const handleGenerateAISuggestions = () => {
    // Simulating AI call with a mock response
    const mockAIResponse = {
      lyrics: "Life is a journey, with ups and downs...",
      style: "Pop, Upbeat"
    };
    setAISuggestions(mockAIResponse);
    setFinalizedSong(mockAIResponse);
  };

  const handleEditFinalizedSong = (field, value) => {
    setFinalizedSong((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentAndGenerateSong = () => {
    // Handle payment logic and song generation via the Suno API
    console.log("Song finalized and sent for generation:", finalizedSong);
  };

  return (
    <MainContainer>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <SongIdeaCard>
          <Typography variant="h5" gutterBottom>
            Enter Your Song Idea
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Describe your song idea..."
            value={songIdea}
            onChange={(e) => setSongIdea(e.target.value)}
            sx={{
              marginBottom: '1rem',
              fontFamily: 'Poppins, Nunito, sans-serif',
            }}
          />
          <StyledButton variant="contained" onClick={handleGenerateAISuggestions}>
            Generate AI Suggestions
          </StyledButton>
        </SongIdeaCard>

        {aiSuggestions && (
          <AIResponseCard>
            <Typography variant="h5" gutterBottom>
              AI Suggestions
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Lyrics"
              value={finalizedSong.lyrics}
              onChange={(e) => handleEditFinalizedSong("lyrics", e.target.value)}
              sx={{
                marginBottom: '1rem',
                fontFamily: 'Poppins, Nunito, sans-serif',
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Style"
              value={finalizedSong.style}
              onChange={(e) => handleEditFinalizedSong("style", e.target.value)}
              sx={{
                fontFamily: 'Poppins, Nunito, sans-serif',
              }}
            />
          </AIResponseCard>
        )}

        {aiSuggestions && (
          <PaymentSection>
            <Typography variant="h5" gutterBottom>
              Finalize & Generate Your Song
            </Typography>
            <StyledButton variant="contained" onClick={handlePaymentAndGenerateSong}>
              Proceed to Payment & Generate Song
            </StyledButton>
          </PaymentSection>
        )}
      </Container>
    </MainContainer>
  );
}
