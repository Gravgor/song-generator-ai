import * as yup from 'yup';

export const SongGenerationSchema = yup.object().shape({
  songIdea: yup.string().required('Please enter your song idea'),
  style: yup.string().when('step', {
    is: (step: number) => step === 1,
    then: (schema) => schema.required('Style is required'),
    otherwise: (schema) => schema
  }),
  tone: yup.string().when('step', {
    is: (step: number) => step === 1,
    then: (schema) => schema.required('Tone is required'),
    otherwise: (schema) => schema
  }),
  vocalStyle: yup.string().when('step', {
    is: (step: number) => step === 1,
    then: (schema) => schema.required('Vocal style is required'),
    otherwise: (schema) => schema
  }),
  influences: yup.string().when('step', {
    is: (step: number) => step === 2,
    then: (schema) => schema.required('Influences are required'),
    otherwise: (schema) => schema
  }),
  songTitle: yup.string().when('step', {
    is: (step: number) => step === 2,
    then: (schema) => schema.required('Song title is required'),
    otherwise: (schema) => schema
  }),
  lyrics: yup.string().when('step', {
    is: (step: number) => step === 2,
    then: (schema) => schema.required('Lyrics are required'),
    otherwise: (schema) => schema
  }),
});
