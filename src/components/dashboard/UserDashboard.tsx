'use client';

import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import SongCard from '../song/SongCard';
import DashboardSidebar from './DashboardSidebar';
import { useMemo, useState } from 'react';
import ChooseClipModal from '../ui/ChooseClipModal';
import { protectedChooseClip } from '@/lib/dashboard/dal';

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

interface Clip {
  id: string;
  clipTitle: string;
  clipAudioUrl: string;
  clipCoverUrl: string;
  clipTags: string;
  createdAt: Date;
  isChosen: boolean;
  isRejected: boolean;
  // ... other clip properties
}

export interface SongGeneration {
  id: string;
  taskID: string;
  generationProgress: string;
  clips: Clip[];
}

interface SongInGeneration {
  id: string;
  userId: string;
  generationProgress: string;
  taskID: string;
}

interface UserDashboardProps {
  completedSongs: Clip[];
  generatedSongs: SongGeneration[];
  rejectedSongs: Clip[];
  generatingSongs: SongInGeneration[];
}

export default function UserDashboard({ 
  completedSongs, 
  generatedSongs, 
  rejectedSongs, 
  generatingSongs 
}: UserDashboardProps) {
  const [selectedGeneration, setSelectedGeneration] = useState<SongGeneration | null>(null);

  const handleChooseClip = async (clipId: string) => {
    if (selectedGeneration) {
      const result = await protectedChooseClip(clipId, selectedGeneration.id);
      if (result.success) {
        setSelectedGeneration(null);
      } else {
        console.error(result.error);
      }
    }
  };

  const pendingGeneratedSongs = useMemo(() => {
    return generatedSongs.filter(gen => 
      !gen.clips.some(clip => clip.isChosen || clip.isRejected)
    );
  }, [generatedSongs]);

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
        
        {generatingSongs.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" gutterBottom>Songs Being Generated</Typography>
            <Grid container spacing={2}>
              {generatingSongs.map((gen) => (
                <Grid item xs={12} sm={6} md={4} key={gen.id}>
                  <Box border={1} borderRadius={2} p={2}>
                    <Typography variant="subtitle1">Task ID: {gen.taskID}</Typography>
                    <Typography>Status: {gen.generationProgress}</Typography>
                    <CircularProgress size={24} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

{pendingGeneratedSongs.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" gutterBottom>Choose Your Favorite Clip</Typography>
            <Grid container spacing={2}>
              {pendingGeneratedSongs.map((gen) => (
                <Grid item xs={12} sm={6} md={4} key={gen.id}>
                  <Box border={1} borderRadius={2} p={2}>
                    <Typography variant="subtitle1">Song: {gen.clips[0].clipTitle}</Typography>
                    <Button onClick={() => setSelectedGeneration(gen)}>
                      Choose Clip
                    </Button>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        <Typography variant="h5" gutterBottom>My Songs</Typography>
        <Grid container spacing={2}>
          {completedSongs.map((song) => (
            <Grid item xs={12} sm={6} md={4} key={song.id}>
              <SongCard
                song={song}
              />
            </Grid>
          ))}
        </Grid>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Rejected Songs</Typography>
          <Grid container spacing={2}>
            {rejectedSongs.map((song) => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                <SongCard song={song} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {selectedGeneration && (
          <ChooseClipModal
            generation={selectedGeneration}
            onChoose={handleChooseClip}
            onClose={() => setSelectedGeneration(null)}
          />
        )}
      </ContentContainer>
    </DashboardContainer>
  );
}