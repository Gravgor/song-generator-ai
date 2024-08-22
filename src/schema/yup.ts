import * as yup from "yup";

export const SongGenerationSchema = yup.object().shape({
    accents: yup.string().required("Accents are required"),
    tone: yup.string().required("Tone is required"),
    vocalStyle: yup.string().required("Vocal style is required"),
    songTitle: yup.string().required("Song title is required"),
    songIdea: yup.string().required("Song idea is required"),
    lyrics: yup.string().required("Lyrics are required"),
    style: yup.string().required("Style is required"),
  });
  