'use client';

import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/system';

const SongCardContainer = styled(Card)({
  marginBottom: '1rem',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const SongCardHeader = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
});

const SongCardButtons = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1rem',
});

export default function SongCard({ song }: { song: any }) {
  return (
    <SongCardContainer>
      <CardContent>
        <SongCardHeader>{song.title}</SongCardHeader>
        <Typography variant="body2" color="textSecondary">
          {song.description || 'No description available.'}
        </Typography>
        <SongCardButtons>
          <Button variant="contained" color="primary">
            Play
          </Button>
          <Button variant="outlined" color="secondary">
            Edit
          </Button>
        </SongCardButtons>
      </CardContent>
    </SongCardContainer>
  );
}
