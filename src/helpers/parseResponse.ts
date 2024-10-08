

export const parseAILyrics = (response: string) => {
   const tagPattern = /\*\*(.*?)\*\*/; 
   const match = response.match(tagPattern);
 
   if (!match) {
     return {
       title: '',
       lyrics: response.trim(),
     };
   }
 
   let title = match[1].trim();
   title = title.replace(/^Title:\s*/, ''); 
   title = title.replace(/"/g, ''); 
 
   let cleanedLyrics = response.replace(match[0], '').trim();
   cleanedLyrics = cleanedLyrics.replace(/\n\s*\n/g, '\n').trim();
 
   return {
     title: title,
     lyrics: cleanedLyrics,
   };
 }
 

 function extractMatch(data: string, fieldName: string) {
   const regex = new RegExp(`${fieldName}:\\s*([\\s\\S]*?)(?=\\n\\S|Style:|Tone:|Vocal Style:|Accents:|Influences:|$)`, 'i');
   const match = data.match(regex);
   return match ? match[1].trim() : null;
 }


 export const parseAISongDetails = (response: string) => {
  const parsedData: any = {};


  const cleandata = response.replace(/'/g, '');
   
  const styleMatch = extractMatch(cleandata, 'Style');
  const toneMatch = extractMatch(cleandata, 'Tone');
  const influencesMatch = extractMatch(cleandata, 'Influences');
  const vocalStyleMatch = extractMatch(cleandata, 'Vocal style');


   if (styleMatch) {
      parsedData.style = styleMatch;
   }
   if (toneMatch) {
      parsedData.tone = toneMatch;
   }
   if (influencesMatch) {
      parsedData.influences = influencesMatch;
   }
   if (vocalStyleMatch) {
      parsedData.vocalStyle = vocalStyleMatch;
   }

 
   return parsedData;
}
