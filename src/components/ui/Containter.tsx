"use client";
import { colors } from '@/style/style';
import { Box } from '@mui/material';
import { styled } from '@mui/system';


  const Container = styled(Box)({
    background: `linear-gradient(to bottom, #FFFFFF, ${colors.background})`, 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    color: colors.text, 
    fontFamily: 'Poppins, Nunito, sans-serif', 
  });

const MainContainer = Container;
export default MainContainer;