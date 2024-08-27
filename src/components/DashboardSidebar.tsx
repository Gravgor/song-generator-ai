'use client';

import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Link from 'next/link';
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarContainer = styled(Box)({
  width: '250px',
  height: '100vh',
  backgroundColor: '#f4f4f4',
  padding: '2rem',
  position: 'fixed',
  top: 0,
  left: 0,
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '2rem',
  textAlign: 'center',
  justifyContent: 'center',
});

const LogoImage = styled('img')({
  width: '50px',
  marginRight: '10px',
});

const AppName = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
});

const StyledListItem = styled(ListItem)({
  borderRadius: '8px',
  marginBottom: '1rem',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

export default function DashboardSidebar() {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src="/images/TuneCraft.webp" alt="App Logo" />
        <AppName>TuneCraft</AppName>
      </LogoContainer>
      <List>
       {/* <StyledListItem component={Link} href="/dashboard">
          <HomeIcon style={{ marginRight: '10px' }} />
          <ListItemText primary="My Songs" />
        </StyledListItem>
        <StyledListItem component={Link} href="/create-song">
          <MusicNoteIcon style={{ marginRight: '10px' }} />
          <ListItemText primary="Generate New Song" />
        </StyledListItem>
        <StyledListItem component={Link} href="/profile">
          <AccountCircleIcon style={{ marginRight: '10px' }} />
          <ListItemText primary="Profile" />
        </StyledListItem>
        <StyledListItem component={Link} href="/settings">
          <SettingsIcon style={{ marginRight: '10px' }} />
          <ListItemText primary="Settings" />
        </StyledListItem>*/}
      </List>
    </SidebarContainer>
  );
}
