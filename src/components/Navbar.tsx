"use client";

import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from 'next/link';

const Logo = styled('img')({
    height: 50, 
    marginRight: 16,
  });
  
type NavbarProps = {
  email?: string | null;
  avatar?: string | null;
}

export default function Navbar({ email, avatar }: NavbarProps) {
   return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ backgroundColor: '#FFFFFF' }}>
    <Toolbar>
      <Link href="/">
      <Logo src="/images/TuneCraft.webp" alt="AI Song Creator Logo" height="50" style={{ marginRight: '16px' }} />
      </Link>
      <Typography variant="h6" sx={{ flexGrow: 1, color: '#333333' }}>
        TuneCraft - AI Song Creator
      </Typography>
      {email ? (
        <div>
          <Button color="inherit" sx={{ textTransform: 'none' }}>
            {email}
          </Button>
          <Button color="primary">
            LOG OUT
          </Button>
        </div>
      ) : (
        <Link href="/auth/signin">
          <Button color="primary">Login</Button>
        </Link>
      )}
    </Toolbar>
  </AppBar>
   ) 
}