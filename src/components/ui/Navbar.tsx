"use client";

import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material";
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import AuthDialog from '@/components/auth/AuthDialog';
import { colors } from '@/style/style';

const StyledAppBar = styled(AppBar)({
  background: 'transparent',
  backdropFilter: 'blur(10px)',
  position: 'fixed', // Change from 'static' to 'fixed'
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1300, // Ensure it's above other elements
});

const Logo = styled('img')({
  height: 40,
  marginRight: 16,
});

const NavButton = styled(Button)({
  color: colors.text,
  textTransform: 'none',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

const UserInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

type NavbarProps = {
  email?: string | null;
  avatar?: string | null;
}

export default function Navbar({ email, avatar }: NavbarProps) {
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  return (
    <>
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <Link href="/" passHref>
            <Logo src="/images/TuneCraft.webp" alt="AI Song Creator Logo" />
          </Link>
          <Typography variant="h6" sx={{ flexGrow: 1, color: colors.text, fontWeight: 'bold' }}>
            TuneCraft - AI Song Creator
          </Typography>
          {email ? (
            <UserInfo>
              <Avatar src={avatar || undefined} alt={email} sx={{ width: 32, height: 32 }} />
              <Typography variant="body2" sx={{ color: colors.text }}>{email}</Typography>
              <NavButton onClick={() => signOut()}>
                Log Out
              </NavButton>
            </UserInfo>
          ) : (
            <NavButton onClick={() => setOpenLoginDialog(true)}>
              Login
            </NavButton>
          )}
        </Toolbar>
      </StyledAppBar>
      {openLoginDialog && (
        <AuthDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
      )}
    </>
  );
}