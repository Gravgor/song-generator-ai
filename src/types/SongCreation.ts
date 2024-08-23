interface SongCreationFormValues {
    songTitle: string;
    songIdea: string;
    lyrics: string;
    style: string;
    tone: string;
    vocalStyle: string;
    accents: string;
  }
  
  interface AISuggestions {
    role: string;
    content: string;
    refusal: null;
  }