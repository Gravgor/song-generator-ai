'use client';

import { useEffect, useState } from 'react';
import { Typography, Box, Grid, StepIcon} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SongGenerationSchema } from '@/schema/yup';
import AuthDialog from '../auth/AuthDialog';
import { useSearchParams } from 'next/navigation';
import { parseAILyrics, parseAISongDetails } from '@/helpers/parseResponse';
import generateSongDetails, { generateLyrics } from '@/app/actions';
import { SongCreationLoading } from './SongCreationLoading';
import { loadStripe } from '@stripe/stripe-js';
import useLocalStorage from '@/hooks/useLocalStorage';
import { protectedClearProgress, protectedLoadProgress, protectedSaveProgress } from '@/lib/songs/dal';
import { Memory, DataObject, CloudQueue, MusicNote, Lightbulb, LibraryMusic } from '@mui/icons-material';
import { CustomSlider, EditableField, FeatureIcon, FormContainer, PricingCard, SliderContainer, SongDetailsContainer, StepHeader, StepIndicator, StyledButton, StyledLinearProgress, StyledTextField } from './styled-components/Form/components';
import * as yup from 'yup';



export default function SongCreationForm({ session }: any) {
  const [initialResponse, setInitialResponse] = useState<any>(null);
  const [finalLyrics, setFinalLyrics] = useState<string>("");
  const [finalTitle, setFinalTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAIResponseReceived, setIsAIResponseReceived] = useState<boolean>(false);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);
  const [step, setStep] = useState(0); 
  const [generationCount, setGenerationCount] = useState(1); 
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const searchParams = useSearchParams();
  const [savedData, setSavedData] = useLocalStorage('songCreationData', {});


  const { control, handleSubmit, formState: { errors, isValid }, trigger, getValues, setValue } = useForm({
    resolver: yupResolver(SongGenerationSchema),
    mode: 'onChange',
    context: { step }, 
  });


  useEffect(() => {
    async function getProgress() {
      const progress = await protectedLoadProgress();
      if (progress) {
        setValue("songIdea", progress.songIdea || "");
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
        setValue("songTitle", data.songTitle || "");
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
        onSubmit({ songIdea: searchParams.get("idea") || "" });
      }
    }
  }, []);


  useEffect(() => {
    const clearDatabaseTimer = setTimeout(async () => {
      if (!isPaymentStarted) {
        await  protectedClearProgress();
        setSavedData({});
        console.log('Cleared song progress from database and local storage after 5 minutes.');
      }
    }, 300000); // 5 minutes in milliseconds

    // Cleanup timer on component unmount
    return () => clearTimeout(clearDatabaseTimer);
  }, [isPaymentStarted]);

  const steps = [
    { label: 'Song Idea', icon: <MusicNote />, description: ' This is the first step in the song creation process. Here, you need to enter your song idea. This will help us generate the best song for you.' },
    { label: 'AI Suggestions', icon: <Lightbulb />, description: ' This is the second step in the song creation process. Here, you can edit the AI suggestions to refine your song details. This will help us generate the best song for you.' },
    { label: 'Finalize Song', icon: <LibraryMusic />, description: ' This is the third and final step in the song creation process. Here, you can finalize your song and pay for it. This will help us generate the best song for you.' },
  ];

  const onSubmit = async (data: any) => {
    console.log(data);
    setLoading(true);
    try {
      if(step === 0) {
        const request = await generateSongDetails(data.songIdea);
        const parsedResponse = parseAISongDetails(request.content);
        setInitialResponse(parsedResponse);
        setValue("style", parsedResponse.style);
        setValue("tone", parsedResponse.tone);
        setValue("vocalStyle", parsedResponse.vocalStyle);
        setIsAIResponseReceived(true);
        setLoading(false);
        setStep(1); 
        setGenerationCount(1);
        saveProgress(1);
      } else if (step === 1) {
        const request = await generateLyrics(
          getValues("songIdea"),
          getValues("style"),
          getValues("tone"),
          getValues("vocalStyle"),
          getValues("influences"),
        );
        const parseLyrics = parseAILyrics(request.content);
        setValue("songTitle", parseLyrics.title);
        setValue("lyrics", parseLyrics.lyrics);
        setFinalTitle(parseLyrics.title);
        setFinalLyrics(parseLyrics.lyrics);
        setLoading(false);
        setStep(2); 
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
    }
  }


  const saveProgress = async (step: number) => {
    const data = getValues();
    const progress = await protectedSaveProgress({ ...data, step });
    if (!session) {
      setSavedData({ ...data, step });
    } else {
      console.log('Progress saved in database:', progress);
    }
  }


  const handleCloseLoginDialog = () => {
    setOpenLoginDialog(false);
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

  const handleNext = () => {
    if (step < 2) setStep(step + 1); // Move to the next step
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1); // Move to the previous step
  };


  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: 
      return (
        <>
          <Controller
            name="songIdea"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <StyledTextField
                fullWidth
                multiline
                rows={4}
                placeholder="Describe your song idea..."
                {...field}
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />
        </>
      )
      case 1:
        return (
          <>
          <Grid container spacing={3}>
            {[
              { icon: Memory, title: "Style", value: "style" },
              { icon: DataObject, title: "Tone", value: "tone" },
              { icon: CloudQueue, title: "Vocal Style", value: "vocalStyle" },
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box component={item.icon} sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h6" gutterBottom>{item.title}</Typography>
                  <Controller
                    key={item.value}
                    name={item.value as "style" | "tone" | "vocalStyle"}
                    control={control}
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <EditableField
                    fullWidth
                    label={item.value.charAt(0).toUpperCase() + item.value.slice(1)}
                    {...field}
                    error={!!error}
                    helperText={error ? error.message : ""}
                    margin="normal"
                  />
                )}
              />
                </Box>
              </Grid>
            ))}
          </Grid>
          </>
        )
      case 2:
        return (
          <>
         <SongDetailsContainer>
         <Controller
            name="songTitle"
            control={control}
            render={({ field, fieldState }) => (
              <StyledTextField
                fullWidth
                label="Song Title"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ""}
              />
            )}
          />
          <Controller
            name="lyrics"
            control={control}
            render={({ field, fieldState }) => (
              <StyledTextField
                fullWidth
                multiline
                rows={10}
                label="Lyrics"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error ? fieldState.error.message : ""}
              />
            )}
          />
         </SongDetailsContainer>
          <PricingCard>
            <Typography variant="h6" sx={{ color: '#FFFFFF', marginBottom: '0.5rem' }}>Pricing Information</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              First generation: £0.99
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Additional generations: £5.00 each
            </Typography>
          </PricingCard>
          </>
        )
      default:
        return null;
    }
  }

  const totalSteps = steps.length;
  
  return (
    <FormContainer maxWidth="md">
      <form onSubmit={handleSubmit(onSubmit)}>
      <StepHeader>
        <StepIndicator>
          <Typography variant="body1">
            Step {step + 1} of {totalSteps}
          </Typography>
          <Typography variant="h6">
            {steps[step].label}
          </Typography>
        </StepIndicator>
        {steps[step].description && (
          <Typography variant="body2" sx={{ marginTop: '1rem', marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            {steps[step].description}
          </Typography>
        )}
        <StyledLinearProgress 
          variant="determinate" 
          value={(step / (totalSteps - 1)) * 100} 
        />
      </StepHeader>
      {renderStepContent(step)}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        {step > 0 && (
          <StyledButton 
            type="button" 
            onClick={() => setStep(step - 1)}
            disabled={loading}
          >
            Back
          </StyledButton>
        )}
        <StyledButton 
          type="submit" 
          disabled={loading || !isValid}
        >
          {step === 2 ? `Pay & Generate Song (£${generationCount === 1 ? '0.99' : '5.00'})` : 'Next'}
        </StyledButton>
      </Box>
      {openLoginDialog && (
        <AuthDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
      )}
      </form>
    </FormContainer>
  );
}
