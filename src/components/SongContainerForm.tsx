"use client";
import { useState } from "react";
import { TextField, Typography, Button, Card, Box, Skeleton, FormHelperText} from "@mui/material";
import { styled } from '@mui/system';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SongGenerationSchema } from "@/schema/yup";
import generateLyrics from "@/actions/actions";
import { parseAIResponse } from "@/helpers/parseResponse";
import { colors } from "@/style/style";
import AuthDialog from "./AuthDialog";

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

export const SongCreationLoading = () => {
  return (
    <AIResponseCard>
      <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="rectangular" width="100%" height={120} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="text" width="100%" height={40} sx={{ marginBottom: '1rem' }} />
      <Skeleton variant="rectangular" width="100%" height={60} sx={{ marginBottom: '1rem' }} />
    </AIResponseCard>
  );
};

export default function SongCreationForm() {
  const [aiSuggestions, setAISuggestions] = useState<any>(null);
  const [finalizedSong, setFinalizedSong] = useState<any>({ title: "", style: "", lyrics: "" });
  const [isAIResponseReceived, setIsAIResponseReceived] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [openLoginDialog, setOpenLoginDialog] = useState<boolean>(false);

  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      songTitle: "",
      songIdea: "",
      lyrics: "",
      style: "",
    },
    resolver: yupResolver(SongGenerationSchema),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    setLoading(true);
    const request = await generateLyrics(data.songTitle, data.songIdea);
    const parsedResponse: any = parseAIResponse(request.content);
    setAISuggestions(parsedResponse);
    setFinalizedSong(parsedResponse);
    setValue("lyrics", parsedResponse.lyrics);
    setValue("style", parsedResponse.style);
    setValue("songTitle", parsedResponse.title);
    setIsAIResponseReceived(true);
    setLoading(false);
  };

  const handleEditFinalizedSong = (field: string, value: string) => {
    setFinalizedSong((prev: any) => ({
      ...prev,
      [field]: value,
    }));
    setValue(field as "style" | "songTitle" | "songIdea" | "lyrics", value);
  };

  const handlePaymentAndGenerateSong = () => {
    const isAuthenticated = false; 
    if (isAuthenticated) {
      console.log("Finalized Song:", finalizedSong);
      // Proceed with payment and song generation
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
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(getValues()); }}>
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
              Generate AI Suggestions
            </StyledButton>
          </SongIdeaCard>
        </form>
      ) : (
        <>
          {loading ? (
            <SongCreationLoading />
          ) : (
            <>
              <AIResponseCard>
                <Typography variant="h5" gutterBottom>
                  AI Suggestions
                </Typography>
                <FormHelperText sx={{ marginBottom: '1rem' }}>
                  You can edit the lyrics and style to better match your preferences.
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
                      onChange={(e) => handleEditFinalizedSong("lyrics", e.target.value)}
                      sx={{
                        marginBottom: '1rem',
                        fontFamily: 'Poppins, Nunito, sans-serif',
                      }}
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
                      onChange={(e) => handleEditFinalizedSong("style", e.target.value)}
                      sx={{
                        fontFamily: 'Poppins, Nunito, sans-serif',
                      }}
                    />
                  )}
                />
                <Controller
                  name="songTitle"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Title"
                      {...field}
                      error={!!fieldState.error}
                      helperText={fieldState.error ? fieldState.error.message : ""}
                      sx={{
                        fontFamily: 'Poppins, Nunito, sans-serif',
                      }}
                    />
                  )}
                />
              </AIResponseCard>

              <PaymentSection>
                <Typography variant="h5" gutterBottom>
                  Finalize & Generate Your Song
                </Typography>
                <StyledButton
                  type="button"
                  variant="contained"
                  onClick={handlePaymentAndGenerateSong}
                >
                  Proceed to Payment & Generate Song
                </StyledButton>
              </PaymentSection>
            </>
          )}
        </>
      )}
      {openLoginDialog && (
        <AuthDialog open={openLoginDialog} onClose={handleCloseLoginDialog} />
      )}

    </>
  );
}