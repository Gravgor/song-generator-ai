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
import generateSongDetails, { checkOutStripe, clearProgress, generateLyrics, getStripePayment, loadProgress, redirectAfterPayment, saveSongProgress } from '@/actions/actions';
import { StyledButton } from './Button';
import { AIResponseCard, SongIdeaCard } from './Cards';
import { SongCreationLoading } from './SongCreationLoading';
import { loadStripe } from '@stripe/stripe-js';
import useLocalStorage from '@/hooks/useLocalStorage';
import useStripeWebhook from '@/hooks/useStripeWebhook';

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

const PricingInfo = styled(Box)({
  padding: '1rem',
  borderRadius: '8px',
  backgroundColor: '#f5f5f5',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginTop: '1rem',
  textAlign: 'center',
});

export default function SongCreationForm({ session }: any) {
  const [initialResponse, setInitialResponse] = useState<any>(null);
  const [finalLyrics, setFinalLyrics] = useState<string>("");
  const [finalTitle, setFinalTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAIResponseReceived, setIsAIResponseReceived] = useState<boolean>(false);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const [step, setStep] = useState(0); // Added step state for progress tracking
  const [generationCount, setGenerationCount] = useState(1); // Track the number of generations
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const searchParams = useSearchParams();
  const [savedData, setSavedData] = useLocalStorage('songCreationData', {});
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


  const saveProgress = async (step: number) => {
    const data = getValues();
    const progress = await saveSongProgress({ ...data, step });
    if (!session) {
      setSavedData({ ...data, step });
    } else {
      console.log('Progress saved in database:', progress);
    }
  }

  const onSubmitInitial: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const request = await generateSongDetails(data.songIdea);
    const parsedResponse = parseAISongDetails(request.content);
    setValue("style", parsedResponse.style);
    setValue("tone", parsedResponse.tone);
    setValue("vocalStyle", parsedResponse.vocalStyle);
    setValue("influences", parsedResponse.influences);
    setInitialResponse(parsedResponse);
    setIsAIResponseReceived(true);
    setLoading(false);
    setStep(1); // Move to the next step
    setGenerationCount(1);
    saveProgress(1);
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
    setFinalTitle(parseLyrics.title);
    setFinalLyrics(parseLyrics.lyrics);
    setValue("songTitle", parseLyrics.title);
    setValue("lyrics", parseLyrics.lyrics);
    setLoading(false);
    setStep(2); 
    setGenerationCount(2); 
    saveProgress(2);
  };

   useEffect(() => {
    async function getProgress() {
      const progress = await loadProgress();
      if (progress) {
        setValue("songIdea", progress.songIdea || "");
        setValue("style", progress.style || "");
        setValue("tone", progress.tone || "");
        setValue("vocalStyle", progress.vocalStyle || "");
        setValue("influences", progress.influences || "");
        setValue("lyrics", progress.lyrics || "");
        setStep(progress.step || 0);
      }
    }
    function getProgressLocal() {
      const data = savedData;
      if (data) {
        setValue("songIdea", data.songIdea || "");
        setValue("style", data.style || "");
        setValue("tone", data.tone || "");
        setValue("vocalStyle", data.vocalStyle || "");
        setValue("influences", data.influences || "");
        setValue("lyrics", data.lyrics || "");
        setStep(data.step || 0);
    }
  }
    if (session) {
      getProgress();
    } else {
      getProgressLocal();
    }
    if (searchParams.has("idea")) {
      if (searchParams.get("idea") === "") {
        setStep(0);
        console.log("No song idea provided");
      } else {
        console.log("Song idea provided:", searchParams.get("idea"));
        setValue("songIdea", searchParams.get("idea") || "");
        onSubmitInitial(getValues());
      }
    }
  }, []);


  useEffect(() => {
    const clearDatabaseTimer = setTimeout(async () => {
      if (!isPaymentStarted) {
        await  clearProgress();
        setSavedData({});
        console.log('Cleared song progress from database and local storage after 5 minutes.');
      }
    }, 300000); // 5 minutes in milliseconds

    // Cleanup timer on component unmount
    return () => clearTimeout(clearDatabaseTimer);
  }, [isPaymentStarted]);


  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
  };

  const handleLogin = () => {
    console.log("Redirecting to login page...");
  };

  const handlePayment = async () => {
    if (session !== null) {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);
      if(!stripe) {
        console.error("Stripe not initialized");
        return;
      }
      setIsPaymentStarted(true);
      try {
        const priceId = generationCount === 1 ? 'price_1Pr3pQHB9eXojLqLP82Jl7T6' : 'price_1Pr3pDHB9eXojLqLsxwhw6ps';
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          body: JSON.stringify({ priceId }),
          headers: {
            "Content-Type": "application/json",
          },
        })
        const sessionRequest = await response.json()
        if(!sessionRequest) {
          throw new Error("No session returned")
        }
        const result = await stripe.redirectToCheckout({
          sessionId: sessionRequest.result.id,
        })
      } catch (error) {
        console.error("Error checking out with Stripe:", error)
      }
    } else {
      setOpenLoginDialog(true);
    }
  };

  const handleSongGeneration = async () => {
    console.log("Generating song...");
  }

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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <StyledButton
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  Generate AI Suggestions
                </StyledButton>
                <Box sx={{ marginLeft: '1rem' }}>
                  {loading && <Skeleton variant="rectangular" width={200} height={40} />}
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
                    label="Influences"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    onChange={(e) => setValue("influences", e.target.value)}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                    }}
                  />
                )}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <StyledButton
                  variant="outlined"
                  disabled={Number(step) === 0}
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
                Step 3: Final Lyrics Of Your Song &quot;<span className='font-bold'>{finalTitle}</span>&quot;
              </Typography>
              <FormHelperText sx={{ marginBottom: '1rem' }}>
                Here are your final song details and lyrics. Click `&quot;`Generate Song`&quot;` to get the final song.
              </FormHelperText>
              <Controller
                name="songTitle"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Song Title"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error ? fieldState.error.message : ""}
                    sx={{
                      marginBottom: '1rem',
                      fontFamily: 'Poppins, Nunito, sans-serif',
                      whiteSpace: 'pre-line',
                    }}
                  />
                )}
              />
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
                  />
                )}
              />
              <PricingInfo>
                <Typography variant="h6">Pricing Information</Typography>
                <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}>
                  First generation: £0.99
                </Typography>
                <Typography variant="body1">
                  Additional generations: £5.00 each
                </Typography>
              </PricingInfo>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <StyledButton
                  variant="outlined"
                  disabled={Number(step) !== 0}
                  onClick={handleBack}
                  sx={{ marginRight: '1rem' }}
                >
                  Back
                </StyledButton>
                <StyledButton
                  type="button"
                  variant="contained"
                  onClick={handlePayment}
                >
                  PAY & GENERATE SONG (£{generationCount === 1 ? '0.99' : '5.00'})
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
