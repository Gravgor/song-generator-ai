'use client';

import { useEffect, useState } from 'react';
import { TextField, Typography, Button, Card, Box, Skeleton, FormHelperText } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SongGenerationSchema } from '@/schema/yup';
import { colors } from '@/style/style';
import AuthDialog from './AuthDialog';
import { useSearchParams } from 'next/navigation';
import { parseAISongDetails } from '@/helpers/parseResponse';
import generateSongDetails, { generateLyrics } from '@/actions/actions';

const SongIdeaCard = styled(Card)({
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
});

const AIResponseCard = styled(Card)({
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '2rem',
  marginBottom: '2rem',
});

const PaymentSection = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '2rem',
  marginTop: '2rem',
});

const StyledButton = styled(Button)({
  backgroundColor: colors.primary,
  color: colors.buttonText,
  '&:hover': {
    backgroundColor: colors.secondary,
  },
  fontFamily: 'Poppins, Nunito, sans-serif',
});

const LargeTextField = styled(TextField)({
  fontSize: '1.2rem',
  lineHeight: '1.5rem',
  padding: '1rem',
});

export const SongCreationLoading = () => (
  <AIResponseCard>
    <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
    <Skeleton variant="rectangular" width="100%" height={120} sx={{ marginBottom: '1rem' }} />
    <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
    <Skeleton variant="rectangular" width="100%" height={60} sx={{ marginBottom: '1rem' }} />
  </AIResponseCard>
);

export default function SongCreationForm() {
  const [initialResponse, setInitialResponse] = useState<any>(null);
  const [finalLyrics, setFinalLyrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAIResponseReceived, setIsAIResponseReceived] = useState<boolean>(false);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      songTitle: "",
      songIdea: "",
      style: "",
      tone: "",
      vocalStyle: "",
      accents: "",
      lyrics: "",
    },
    resolver: yupResolver(SongGenerationSchema),
  });

  // Handle initial submission to get style, tone, vocal style, and accents
  const onSubmitInitial: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const request = await generateSongDetails(data.songIdea);
    const parsedResponse = parseAISongDetails(request.content);
    setValue("style", parsedResponse.style);
    setValue("tone", parsedResponse.tone);
    setValue("vocalStyle", parsedResponse.vocalStyle);
    setValue("accents", parsedResponse.accents);
    setInitialResponse(parsedResponse);
    setIsAIResponseReceived(true);
    setLoading(false);
  };

  const onSubmitFinal: SubmitHandler<any> = async (data) => {
    console.log(data);
    setLoading(true);
    const request = await generateLyrics(getValues("songIdea"), getValues("style"), getValues("tone"), getValues("vocalStyle"), getValues("accents")
    );
    setFinalLyrics(request);
    setLoading(false);
  };

  useEffect(() => {
    if (searchParams.has("idea")) {
      setValue("songIdea", searchParams.get("idea") || "");
    }
  }, []);

  const handlePaymentAndGenerateSong = () => {
    const isAuthenticated = false; // Replace with actual authentication check
    if (isAuthenticated) {
      onSubmitFinal(getValues());
    } else {
      setOpenLoginDialog(true);
    }
  };

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLogin = () => {
    console.log("Redirecting to login page...");
  };

  
  return (
    <>
      {!isAIResponseReceived ? (
        <form onSubmit={(e) => {
          e.preventDefault(); onSubmitInitial(getValues())
        }}>
          <SongIdeaCard>
            <Typography variant="h5" gutterBottom>
              Enter Your Song Title
            </Typography>
            <Controller
              name="songTitle"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your song title..."
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ""}
                  sx={{
                    marginBottom: '1rem',
                    fontFamily: 'Poppins, Nunito, sans-serif',
                  }}
                />
              )}
            />
            <Typography variant="h5" gutterBottom>
              Enter Your Song Idea
            </Typography>
            <Controller
              name="songIdea"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Describe your song idea..."
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error ? fieldState.error.message : ""}
                  sx={{
                    marginBottom: '1rem',
                    fontFamily: 'Poppins, Nunito, sans-serif',
                  }}
                />
              )}
            />
            <StyledButton type="submit" variant="contained">
              Get AI Style & Tone Suggestions
            </StyledButton>
          </SongIdeaCard>
        </form>
      ) : (
        <>
          {loading ? (
            <SongCreationLoading />
          ) : finalLyrics ? (
            <AIResponseCard>
              <Typography variant="h5" gutterBottom>
                Final Lyrics
              </Typography>
              <FormHelperText sx={{ marginBottom: '1rem' }}>
                Here are your final song details and lyrics. Click &quot;Generate Song&quot; to get the final song.
              </FormHelperText>
              <Controller
                name="lyrics"
                control={control}
                render={({ field, fieldState }) => (
                  <LargeTextField
                    fullWidth
                    multiline
                    rows={10}
                    variant="outlined"
                    label="Lyrics"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={finalLyrics.content}
                  />
                )}
              />
              <Controller
                name="style"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Style"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.style || ''}
                  />
                )}
              />
              <Controller
                name="tone"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Tone"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.tone || ''}
                  />
                )}
              />
              <Controller
                name="vocalStyle"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Vocal Style"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.vocalStyle || ''}
                  />
                )}
              />
              <Controller
                name="accents"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Accents"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.accents || ''}
                  />
                )}
              />
              <StyledButton
                type="button"
                variant="contained"
                onClick={handlePaymentAndGenerateSong}
              >
                Generate Song
              </StyledButton>
            </AIResponseCard>
          ) : (
            <AIResponseCard>
              <Typography variant="h5" gutterBottom>
                AI Style & Tone Suggestions
              </Typography>
              <FormHelperText sx={{ marginBottom: '1rem' }}>
                Edit the suggestions and click &quot;Generate Final Lyrics&quot; to get the final song lyrics.
              </FormHelperText>
              <Controller
                name="style"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Style"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("style", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.style || ''}
                  />
                )}
              />
              <Controller
                name="tone"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Tone"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("tone", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.tone || ''}
                  />
                )}
              />
              <Controller
                name="vocalStyle"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Vocal Style"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("vocalStyle", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.vocalStyle || ''}
                  />
                )}
              />
              <Controller
                name="accents"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Accents"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("accents", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.accents || ''}
                  />
                )}
              />
              <StyledButton
                type="button"
                variant="contained"
                onClick={onSubmitFinal}
              >
                Generate Final Lyrics
              </StyledButton>
            </AIResponseCard>
          )}
          {openLoginDialog && (
            <AuthDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
          )}
        </>
      )}
    </>
  );
}