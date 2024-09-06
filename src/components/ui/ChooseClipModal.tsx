import { Dialog, DialogTitle, DialogContent, Button, Grid, Typography, Box, Skeleton } from '@mui/material';
import { styled } from '@mui/system';
import SongCard from '../song/SongCard';
import { SongGeneration } from '../dashboard/UserDashboard';
import { colors } from '@/style/style';
import { useState, useEffect } from 'react';

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  color: '#FFFFFF',
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '1.5rem',
});

const StyledDialogContent = styled(DialogContent)({
  padding: '1.5rem',
});

const ChooseButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  textTransform: 'none',
  fontWeight: 'bold',
  marginTop: '1rem',
  '&:hover': {
    backgroundColor: colors.secondary,
  },
});

const ClipContainer = styled(Box)({
  marginBottom: '1.5rem',
});

const SkeletonContainer = styled(Box)({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '1rem',
});

interface ChooseClipModalProps {
  generation: SongGeneration;
  onChoose: (clipId: string) => void;
  onClose: () => void;
}

export default function ChooseClipModal({ generation, onChoose, onClose }: ChooseClipModalProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderSkeleton = () => (
    <SkeletonContainer>
      <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
      <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }} />
      <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', mt: 2 }} />
    </SkeletonContainer>
  );

  return (
    <StyledDialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>Choose Your Favorite Clip</StyledDialogTitle>
      <StyledDialogContent>
        <Grid container spacing={3}>
          {loading
            ? Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {renderSkeleton()}
                </Grid>
              ))
            : generation.clips.map((clip) => (
                <Grid item xs={12} sm={6} key={clip.id}>
                  <ClipContainer>
                    <SongCard song={clip} />
                    <ChooseButton onClick={() => onChoose(clip.id)} fullWidth>
                      Choose This Clip
                    </ChooseButton>
                  </ClipContainer>
                </Grid>
              ))}
        </Grid>
      </StyledDialogContent>
    </StyledDialog>
  );
}