'use client';

import { Card, CardContent, Typography, Button, Box, Grid } from '@mui/material';
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

const CoverImage = styled('img')({
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
});

export default function SongCard({ song }: { song: any }) {
  return (
    <SongCardContainer>
      <CardContent>
        <Grid container spacing={2}>
          {/* Left side: Cover Image */}
          <Grid item xs={4} md={3}>
            <CoverImage src={song.cover_url_small || '/default-cover.jpg'} alt={song.title} />
          </Grid>
          
          {/* Right side: Song Info */}
          <Grid item xs={8} md={9}>
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
          </Grid>
        </Grid>
      </CardContent>
    </SongCardContainer>
  );
}
