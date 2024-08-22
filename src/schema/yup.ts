import * as yup from "yup";

export const SongGenerationSchema = yup.object().shape({
    songTitle: yup.string().required("Song title is required"),
    songIdea: yup.string().required("Song idea is required"),
    lyrics: yup.string().required("Lyrics are required"),
    style: yup.string().required("Style is required"),
  });
  