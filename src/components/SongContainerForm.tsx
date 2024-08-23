'use client';

import { useEffect, useState } from 'react';
import { TextField, Typography, Box, Skeleton, FormHelperText, Slider, Paper } from '@mui/material';
import { styled } from '@mui/system';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SongGenerationSchema } from '@/schema/yup';
import AuthDialog from './AuthDialog';
import { useSearchParams } from 'next/navigation';
import { parseAILyrics, parseAISongDetails } from '@/helpers/parseResponse';
import generateSongDetails, { generateLyrics, handlePaymentAndSongGeneration } from '@/actions/actions';
import { StyledButton } from './Button';
import { AIResponseCard, SongIdeaCard } from './Cards';
import { SongCreationLoading } from './SongCreationLoading';

const PaymentSection = styled(Box)({
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  padding: '2rem',
  marginTop: '2rem',
});

const LargeTextField = styled(TextField)({
  fontSize: '1.2rem',
  lineHeight: '1.5rem',
  padding: '1rem',
});

export default function SongCreationForm({ session }: any) {
  const [initialResponse, setInitialResponse] = useState<any>(null);
  const [finalLyrics, setFinalLyrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAIResponseReceived, setIsAIResponseReceived] = useState<boolean>(false);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const [step, setStep] = useState(0); // Added step state for progress tracking

  const searchParams = useSearchParams();
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      songTitle: "",
      songIdea: "",
      style: "",
      tone: "",
      vocalStyle: "",
      influences: "",
      lyrics: "",
    },
    resolver: yupResolver(SongGenerationSchema),
  });

  const onSubmitInitial: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const request = await generateSongDetails(data.songIdea);
    const parsedResponse = parseAISongDetails(request.content);
    console.log(parsedResponse);
    setValue("style", parsedResponse.style);
    setValue("tone", parsedResponse.tone);
    setValue("vocalStyle", parsedResponse.vocalStyle);
    setValue("influences", parsedResponse.influences);
    setInitialResponse(parsedResponse);
    setIsAIResponseReceived(true);
    setLoading(false);
    setStep(1); // Move to the next step
  };

  const onSubmitFinal: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const request = await generateLyrics(
      getValues("songIdea"),
      getValues("style"),
      getValues("tone"),
      getValues("vocalStyle"),
      getValues("influences"),
    );
    const parseLyrics = parseAILyrics(request.content);
    console.log(parseLyrics);
    setFinalLyrics(parseLyrics);
    setLoading(false);
    setStep(2); // Move to the final step
  };

  useEffect(() => {
    if (searchParams.has("idea")) {
      setValue("songIdea", searchParams.get("idea") || "");
    }
  }, []);

  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLogin = () => {
    console.log("Redirecting to login page...");
  };

  const handlePaymentAndGeneration = async () => {
    if (session !== null) {
      console.log("Payment successful, generating song...");
      const response = await handlePaymentAndSongGeneration(getValues());
      console.log(response);
    } else {
      setOpenLoginDialog(true);
    }
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1); // Move to the next step
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1); // Move to the previous step
  };

  return (
    <>
      <Box sx={{ width: '100%', marginBottom: '1rem', marginLeft: '2.2rem' }}>
      <Slider
          value={step}
          min={0}
          max={2}
          step={1}
          marks={[
            { value: 0, label: 'Song Idea' },
            { value: 1, label: 'AI Suggestions' },
            { value: 2, label: 'Finalize Song' },
          ]}
          sx={{ marginBottom: '1rem'}}
        />
      </Box>
      {step === 0 && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmitInitial(getValues());
            }}
          >
            
            <SongIdeaCard>
            <Typography variant="h6" gutterBottom>
            Step 1: Enter Your Song Idea
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
              <Box sx={{ display: 'flex', justifyContent: 'flex', marginTop: '1rem' }}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Generate AI Suggestions
                </StyledButton>
                <Box sx={{ marginLeft: '1rem' }}>
                  {loading && <Skeleton variant="rectangular" width={200} height={40} />}
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {isAIResponseReceived ? "AI Suggestions Generated!" : ""}
                  </Typography>
                  </Box>
              </Box>
            </SongIdeaCard>
          </form>
        </>
      )}
      {step === 1 && (
        <>
          {loading ? (
            <SongCreationLoading />
          ) : (
            <AIResponseCard>
                        <Typography variant="h6" gutterBottom>
            Step 2: AI Suggestions
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
                name="influences"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Accents"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("influences", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                    value={initialResponse?.influences.replace(/{|}/g, '') || ''}
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <StyledButton
                  variant="outlined"
                  disabled={step === 0}
                  onClick={handleBack}
                  sx={{ marginRight: '1rem' }}
                >
                  Back
                </StyledButton>
                <StyledButton
                  type="button"
                  variant="contained"
                  onClick={onSubmitFinal}
                >
                  Generate Final Lyrics
                </StyledButton>
                <StyledButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={step === 2 || loading}
                  sx={{ marginLeft: '1rem' }}
                >
                  Next
                </StyledButton>
              </Box>
            </AIResponseCard>
          )}
        </>
      )}
      {step === 2 && (
        <>
          {loading ? (
            <SongCreationLoading />
          ) : (
            <AIResponseCard>
              <Typography variant="h5" gutterBottom>
                Step 3: Final Lyrics Of Your Song &quot;<span className='font-bold'>{finalLyrics?.title}</span>&quot;
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
                      whiteSpace: 'pre-line',
                    }}
                    value={finalLyrics?.lyrics || ''}
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
                name="influences"
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
                    value={initialResponse?.influences.replace(/{|}/g, '') || ''}
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <StyledButton
                  variant="outlined"
                  disabled={step === 0}
                  onClick={handleBack}
                  sx={{ marginRight: '1rem' }}
                >
                  Back
                </StyledButton>
                <StyledButton
                  type="button"
                  variant="contained"
                  onClick={handlePaymentAndGeneration}
                >
                  Generate Song
                </StyledButton>
                <StyledButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={step === 2 || loading}
                  sx={{ marginLeft: '1rem' }}
                >
                  Next
                </StyledButton>
              </Box>
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
