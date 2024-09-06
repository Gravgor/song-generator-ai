"use client";

import { Box, Grid, Typography, Skeleton } from '@mui/material';
import { styled } from '@mui/system';
import { colors } from '@/style/style';

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(to bottom, ${colors.background} 0%, #1a2a4a 100%)`,
  color: '#FFFFFF',
  paddingTop: '2rem',
  paddingBottom: '2rem',
});

const ContentContainer = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#FFFFFF',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
});

const SkeletonCard = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '1.5rem',
  marginBottom: '1rem',
});

const HeaderSkeleton = () => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
    <Skeleton variant="text" width={200} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
    <Skeleton variant="rectangular" width={180} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
  </Box>
);

const SongCardSkeleton = () => (
  <SkeletonCard>
    <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
    <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }} />
    <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }} />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Skeleton variant="rectangular" width="30%" height={36} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      <Skeleton variant="rectangular" width="30%" height={36} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      <Skeleton variant="rectangular" width="30%" height={36} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
    </Box>
  </SkeletonCard>
);

export default function UserDashboardLoading() {
  return (
    <DashboardContainer>
      <ContentContainer>
        <HeaderSkeleton />
        
        <Box mb={4}>
          <SectionTitle>Songs Being Generated</SectionTitle>
          <SkeletonCard>
            <Skeleton variant="rectangular" width="100%" height={100} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
          </SkeletonCard>
        </Box>

        <Box mb={4}>
          <SectionTitle>Choose Your Favorite Clip</SectionTitle>
          <Grid container spacing={3}>
            {[1, 2, 3].map((index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SongCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mb={4}>
          <SectionTitle>My Songs</SectionTitle>
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SongCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box mt={4}>
          <SectionTitle>Rejected Songs</SectionTitle>
          <Grid container spacing={3}>
            {[1, 2, 3].map((index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <SongCardSkeleton />
              </Grid>
            ))}
          </Grid>
        </Box>
      </ContentContainer>
    </DashboardContainer>
  );
}