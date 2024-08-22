"use client";

import { styled } from '@mui/system';
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Logo = styled('img')({
    height: 50, 
    marginRight: 16,
  });
  

export default function Navbar() {
   return (
    <AppBar position="static" color="default" elevation={0}>
    <Toolbar>
      <Logo src="/images/TuneCraft.png" alt="AI Song Creator Logo" height="50" style={{ marginRight: '16px' }} />
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        AI Song Creator
      </Typography>
      <Button color="primary">Login</Button>
      <Button variant="outlined" color="primary">
        Sign Up
      </Button>
    </Toolbar>
  </AppBar>
   ) 
}