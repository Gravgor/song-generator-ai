import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Card, TextField, Button, LinearProgress, Paper } from "@mui/material";
import Slider from "react-slick";
import { Edit as EditIcon } from '@mui/icons-material';
import { colors } from "@/style/style";


export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    marginBottom: '3rem',
    height: 8,
    borderRadius: 4,
  }));
  
  
  export const StyledEditIcon = styled(EditIcon)(({ theme }) => ({
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    cursor: 'pointer',
    color: colors.primary,
  }));

  export const StepHeader = styled(Box)(({ theme }) => ({
    color: '#FFFFFF',
    marginBottom: '1rem',
  }));
  
  export const StepIndicator = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  }));


export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const FormContainer = styled(Box)({
  padding: '2rem',
  borderRadius: '12px',
  background: `linear-gradient(45deg, ${colors.background} 0%, #1a2a4a 100%)`,
  backgroundSize: '200% 200%',
  animation: `${gradientShift} 15s ease infinite`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
});


export const SliderContainer = styled(Box)({
  marginBottom: '2rem',
  padding: '1rem',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
});

export const StepIcon = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  color: colors.primary,
});

export const CustomSlider = styled(Slider)({
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-track': {
    height: 4,
    backgroundColor: colors.primary,
  },
  '& .MuiSlider-rail': {
    height: 4,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 8,
    borderRadius: '50%',
  },
  '& .MuiSlider-markActive': {
    opacity: 1,
    backgroundColor: 'currentColor',
  },
});

export const FeatureIcon = styled(Box)({
  fontSize: 40,
  color: colors.primary,
  marginBottom: '1rem',
});

export const StyledCard = styled(Card)({
  backgroundColor: 'rgba(255, 255, 255, 0.0)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  padding: '2rem',
  color: '#FFFFFF',
});

export const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
      boxShadow: '0 0 0 2px rgba(66, 153, 225, 0.2)',
    },
  },
  '& .MuiInputBase-input': {
    color: colors.text,
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'rgba(255, 255, 255, 0.5)',
    opacity: 1,
  },
});
export const PricingCard = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '8px',
  padding: '1rem',
  marginTop: '1rem',
});

export const StyledButton = styled(Button)({
  backgroundColor: colors.primary,
  color: colors.text,
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: colors.secondary,
    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
    transform: 'translateY(-2px)',
  },
});
    
export const EditableField = styled(TextField)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  marginTop: '0.5rem',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.primary,
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: colors.text,
  },
  '&:hover .editIcon': {
    opacity: 1,
  },
});

export const SongDetailsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }));