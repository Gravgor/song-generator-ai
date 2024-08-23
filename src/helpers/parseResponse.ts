

export const parseAILyrics = (response: string) => {
   const tagPattern = /\*\*.*?\:\*\*/g;
   let cleanedLyrics = response.replace(tagPattern, '');
    cleanedLyrics = cleanedLyrics.replace(/\n\s*\n/g, '\n').trim();
   return {
      lyrics: cleanedLyrics,
   };
 }
 


 export const parseAISongDetails = (response: string) => {
  const parsedData: any = {};


  const cleandata = response.replace(/'/g, '');
   
 const styleMatch = cleandata.match(/Style:\s*([\s\S]*?)(?=\n\S|Tone:|Vocal Style:|Accents:|$)/);
 const toneMatch = cleandata.match(/Tone:\s*([\s\S]*?)(?=\n\S|Style:|Vocal Style:|Accents:|$)/);
 const vocalStyleMatch = cleandata.match(/Vocal style:\s*([\s\S]*?)(?=\n\S|Style:|Tone:|Accents:|$)/);
 const accentsMatch = cleandata.match(/Accents:\s*([\s\S]*?)(?=\n\S|Style:|Tone:|Vocal Style:|$)/);

 parsedData.style = styleMatch ? styleMatch[1].trim() : '**';
 parsedData.tone = toneMatch ? toneMatch[1].trim() : '**';
 parsedData.vocalStyle = vocalStyleMatch ? vocalStyleMatch[1].trim() : '**';
 parsedData.accents = accentsMatch ? accentsMatch[1].trim() : '**';
 
   return parsedData;
}
