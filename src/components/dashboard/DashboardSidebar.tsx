'use client';

import { Box, List, Typography, ListItem, ListItemIcon, ListItemText } from '@mui/material';
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
  marginBottom: '1rem',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export default function DashboardSidebar() {
  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src="/images/TuneCraft.webp" alt="App Logo" />
        <AppName>TuneCraft</AppName>
      </LogoContainer>
      <List>
        <StyledListItem>
          <StyledLink href="/dashboard">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/my-music">
            <ListItemIcon>
              <MusicNoteIcon />
            </ListItemIcon>
            <ListItemText primary="My Music" />
          </StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </StyledLink>
        </StyledListItem>
        <StyledListItem>
          <StyledLink href="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </StyledLink>
        </StyledListItem>
      </List>
    </SidebarContainer>
  );
}