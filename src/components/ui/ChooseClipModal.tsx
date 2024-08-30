import { Dialog, DialogTitle, DialogContent, Button, Grid } from '@mui/material';
import SongCard from '../song/SongCard';
import { SongGeneration } from '../dashboard/UserDashboard';

interface ChooseClipModalProps {
  generation: SongGeneration;
  onChoose: (clipId: string) => void;
  onClose: () => void;
}

export default function ChooseClipModal({ generation, onChoose, onClose }: ChooseClipModalProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Choose Your Favorite Clip</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {generation.clips.map((clip) => (
            <Grid item xs={12} sm={6} key={clip.id}>
              <SongCard song={clip} />
              <Button onClick={() => onChoose(clip.id)} fullWidth variant="contained">
                Choose This Clip
              </Button>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}