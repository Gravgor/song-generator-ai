export interface SongCreationFormValues {
    songTitle: string;
    songIdea: string;
    lyrics: string;
    style: string;
    tone: string;
    vocalStyle: string;
    influences: string;
  }
  
  export interface AISuggestions {
    role: string;
    content: string;
    refusal: null;
  }