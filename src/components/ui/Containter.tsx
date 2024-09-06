"use client"
import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { colors } from '@/style/style';

const MainContainerWrapper = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(135deg, ${colors.background} 0%, #1a2a4a 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 5%),
      radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 5%)
    `,
    opacity: 0.5,
    zIndex: 1,
  },
});

const ContentWrapper = styled(Box)({
  position: 'relative',
  zIndex: 2,
});

export default function MainContainer({ children }: { children: React.ReactNode }) {
  return (
    <MainContainerWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </MainContainerWrapper>
  );
}