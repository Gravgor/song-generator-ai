"use client";
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button, Tab, Tabs, Box } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/style/style';
import { createUser } from '@/app/actions';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Google as GoogleIcon } from '@mui/icons-material';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  color: colors.text,
  fontWeight: 'bold',
  textAlign: 'center',
  paddingTop: '24px',
});

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: colors.primary,
  },
});

const StyledTab = styled(Tab)({
  color: colors.text,
  '&.Mui-selected': {
    color: colors.primary,
  },
});

const StyledTextField = styled(TextField)({
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
});

const StyledButton = styled(Button)({
  backgroundColor: colors.primary,
  color: colors.text,
  '&:hover': {
    backgroundColor: colors.secondary,
  },
  fontFamily: 'Poppins, Nunito, sans-serif',
  textTransform: 'none',
  fontWeight: 'bold',
  padding: '10px 0',
  fontSize: '1rem',
});

const GoogleButton = styled(StyledButton)({
  backgroundColor: '#4285F4',
  '&:hover': {
    backgroundColor: '#357ae8',
  },
});

const AuthDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [tabValue, setTabValue] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const { login, register } = useAuth(); 
  const pathname = usePathname();

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'login' | 'register') => {
    setTabValue(newValue);
  };

  const handleLogin = () => {
    try {
      signIn('credentials', { email, password, callbackUrl: `http://localhost:3000/${pathname}` });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginGoogle = () => {
    try {
      signIn('google', { callbackUrl: `http://localhost:3000/${pathname}` });
    } catch (error) {
      console.error(error);
    }
  }

  const handleRegister = async () => {
    const newUser = await createUser(email, username, password);
    if (newUser) {
      signIn('credentials', { email, password });
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <StyledDialogTitle>Login or Register</StyledDialogTitle>
      <DialogContent>
        <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="login or register tabs" centered>
          <StyledTab label="Login" value="login" />
          <StyledTab label="Register" value="register" />
        </StyledTabs>
        <Box sx={{ mt: 3 }}>
          {tabValue === 'login' && (
            <Box>
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <StyledButton fullWidth variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
                Login
              </StyledButton>
              <GoogleButton fullWidth variant="contained" onClick={handleLoginGoogle} sx={{ mt: 2 }}>
                <GoogleIcon sx={{ mr: 1 }} /> Login with Google
              </GoogleButton>
            </Box>
          )}
          {tabValue === 'register' && (
            <Box>
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <StyledTextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <StyledButton fullWidth variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
                Register
              </StyledButton>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: colors.text }}>
          Cancel
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default AuthDialog;