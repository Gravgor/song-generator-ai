'use client';

import { Box, Grid, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import SongCard from '../song/SongCard';
import { useMemo, useState } from 'react';
import ChooseClipModal from '../ui/ChooseClipModal';
import { protectedChooseClip } from '@/lib/dashboard/dal';
import SongGenerationStatus from './SongGenerationStatus';
import { colors } from '@/style/style';
import { Add as AddIcon } from '@mui/icons-material';

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: `linear-gradient(to bottom, ${colors.background} 0%, #1a2a4a 100%)`,
  color: '#FFFFFF',
  paddingTop: '2rem',
  paddingBottom: '2rem',
});

const ContentContainer = styled(Container)({
  maxWidth: '1200px',
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#FFFFFF',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
});

const StyledCard = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  padding: '1.5rem',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
  },
});

const GenerateButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: colors.secondary,
  },
});

const ChooseClipButton = styled(Button)({
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  color: '#FFFFFF',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
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

  const hasSongs = completedSongs.length > 0 || generatedSongs.length > 0 || rejectedSongs.length > 0 || generatingSongs.length > 0;

  return (
    <DashboardContainer>
      <ContentContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <SectionTitle variant="h4">User Dashboard</SectionTitle>
          <GenerateButton
            variant="contained"
            startIcon={<AddIcon />}
            href="/create-song"
          >
            Generate New Song
          </GenerateButton>
        </Box>
        
        {!hasSongs ? (
          <StyledCard sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#FFFFFF' }}>You don't have any songs yet</Typography>
            <Typography variant="body1" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Start by generating your first song!</Typography>
            <GenerateButton
              variant="contained"
              startIcon={<AddIcon />}
              href="/create-song"
              sx={{ mt: 2 }}
            >
              Generate New Song
            </GenerateButton>
          </StyledCard>
        ) : (
          <>
            {generatingSongs.length > 0 && (
              <Box mb={4}>
                <SectionTitle>Songs Being Generated</SectionTitle>
                <StyledCard>
                  <SongGenerationStatus taskId={generatingSongs[0].taskID} userId={generatingSongs[0].userId} />
                </StyledCard>
              </Box>
            )}

            {pendingGeneratedSongs.length > 0 && (
              <Box mb={4}>
                <SectionTitle>Choose Your Favorite Clip</SectionTitle>
                <Grid container spacing={3}>
                  {pendingGeneratedSongs.map((gen) => (
                    <Grid item xs={12} sm={6} md={4} key={gen.id}>
                      <StyledCard>
                        <Typography variant="subtitle1" sx={{ color: '#FFFFFF', mb: 2 }}>Song: {gen.clips[0].clipTitle}</Typography>
                        <ChooseClipButton onClick={() => setSelectedGeneration(gen)}>
                          Choose Clip
                        </ChooseClipButton>
                      </StyledCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {completedSongs.length > 0 && (
              <Box mb={4}>
                <SectionTitle>My Songs</SectionTitle>
                <Grid container spacing={3}>
                  {completedSongs.map((song) => (
                    <Grid item xs={12} sm={6} md={4} key={song.id}>
                      <SongCard song={song} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {rejectedSongs.length > 0 && (
              <Box mt={4}>
                <SectionTitle>Rejected Songs</SectionTitle>
                <Grid container spacing={3}>
                  {rejectedSongs.map((song) => (
                    <Grid item xs={12} sm={6} md={4} key={song.id}>
                      <SongCard song={song} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {selectedGeneration && (
              <ChooseClipModal
                generation={selectedGeneration}
                onChoose={handleChooseClip}
                onClose={() => setSelectedGeneration(null)}
              />
            )}
          </>
        )}
      </ContentContainer>
    </DashboardContainer>
  );
}