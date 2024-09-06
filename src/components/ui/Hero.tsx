"use client";
import { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, Button, Container, Box, TextField, keyframes } from "@mui/material";
import { motion } from 'framer-motion';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { colors } from '@/style/style';


const HeroSection = styled(Box)({
  padding: '6rem 0',
  textAlign: 'center',
  color: '#FFFFFF',
  position: 'relative',
  zIndex: 1,
});

const StyledTextField = styled(TextField)({
  marginBottom: '1.5rem',
  width: '100%',
  maxWidth: '800px', // Increased max-width for prominence
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    borderRadius: '8px', // Rounded corners
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderWidth: '2px', // Thicker border for prominence
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF',
    },
  },
  '& .MuiInputBase-input': {
    color: '#FFFFFF',
    fontSize: '1.2rem', // Larger font size
    padding: '1rem', // More padding for larger appearance
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1.1rem', // Larger label font size
  },
});

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledButton = styled(Button)({
  marginTop: '2rem',
  padding: '1rem 2.5rem',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: '50px',
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    background: 'linear-gradient(45deg, #1E88E5 30%, #1CB5E0 90%)',
    animation: `${pulse} 1.5s infinite`,
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
  },
});

const AnimatedIcon = styled(AutoFixHighIcon)({
  animation: `${rotate} 2s linear infinite`,
});

export default function Hero() {
  const [songIdea, setSongIdea] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSongIdea(event.target.value);
  };

  const handleSubmit = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.location.href = `/create-song?idea=${encodeURIComponent(songIdea)}`;
    }, 2000);
  };

  return (
    <HeroSection>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
            Create Your Perfect Song with AI
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            Transform your ideas into lyrics, and let AI generate a song just for you.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StyledTextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Enter your song idea here... (e.g., A upbeat pop song about overcoming challenges and finding inner strength)"
            value={songIdea}
            onChange={handleInputChange}
          />
          
          <StyledButton
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={isGenerating}
            startIcon={isGenerating ? <AnimatedIcon /> : null}
          >
            {isGenerating ? 'Generating...' : 'Generate Your Song Now'}
          </StyledButton>
        </motion.div>
      </Container>
    </HeroSection>
  );
}