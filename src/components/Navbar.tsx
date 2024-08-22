"use client";

import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from 'next/link';

const Logo = styled('img')({
    height: 50, 
    marginRight: 16,
  });
  

export default function Navbar() {
   return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ backgroundColor: '#FFFFFF' }}>
    <Toolbar>
      <Link href="/">
      <Logo src="/images/TuneCraft.webp" alt="AI Song Creator Logo" height="50" style={{ marginRight: '16px' }} />
      </Link>
      <Typography variant="h6" sx={{ flexGrow: 1, color: '#333333' }}>
        TuneCraft - AI Song Creator
      </Typography>
      <Button color="primary">Login</Button>
      <Button variant="outlined" color="primary">
        Sign Up
      </Button>
    </Toolbar>
  </AppBar>
   ) 
}