"use client";
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, Button, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/system';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/style/style';
import { createUser } from '@/actions/actions';
import { signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';


const StyledButton = styled(Button)({
  backgroundColor: colors.primary,
  color: colors.text,
  '&:hover': {
    backgroundColor: colors.secondary,
  },
  fontFamily: 'Poppins, Nunito, sans-serif',
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
      signIn('credentials',
         { email, password, callbackUrl: `http://localhost:3000/${pathname}` });
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Login or Register</DialogTitle>
      <DialogContent>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="login or register tabs">
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>
        {tabValue === 'login' && (
          <div>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
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
            <StyledButton fullWidth variant="contained" onClick={handleLoginGoogle} sx={{ mt: 2 }}>
              Login with Google
            </StyledButton>
          </div>
        )}
        {tabValue === 'register' && (
          <div>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
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
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
