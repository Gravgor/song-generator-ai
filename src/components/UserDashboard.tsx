'use client';

import { Box, Grid, Typography, Button } from '@mui/material';
import { styled } from '@mui/system';
import SongCard from './SongCard';
import DashboardSidebar from './DashboardSidebar';

const DashboardContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
});

const ContentContainer = styled(Box)({
  marginLeft: '250px',
  padding: '2rem',
  width: '100%',
});

const HeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
});

const EmptyStateContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
  marginTop: '5rem',
});

export default function UserDashboard({ songs }: { songs: any[] }) {
  const hasSongs = songs && songs.length > 0;

  return (
    <DashboardContainer>
      <DashboardSidebar />
      <ContentContainer>
        <HeaderContainer>
          <Typography variant="h4">My Songs</Typography>
          <Button variant="contained" color="primary" href="/create-song">
            Generate New Song
          </Button>
        </HeaderContainer>
        
        {hasSongs ? (
          <Grid container spacing={2}>
            {songs.map((song) => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                <SongCard song={song} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyStateContainer>
            <Typography variant="h5" gutterBottom>
              You haven’t created any songs yet.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Get started by creating your first song now!
            </Typography>
            <Button variant="contained" color="primary" href="/create-song">
              Create Your First Song
            </Button>
          </EmptyStateContainer>
        )}
      </ContentContainer>
    </DashboardContainer>
  );
}
