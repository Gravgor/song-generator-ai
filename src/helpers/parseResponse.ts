

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
  const styleMatch = response.match(/Style:\s*([^\n]*)/);
  const toneMatch = response.match(/Tone:\s*([^\n]*)/);
  const vocalStyleMatch = response.match(/Vocal Style:\s*([^\n]*)/);
  const accentsMatch = response.match(/Accents:\s*([\s\S]*)/);

  if (styleMatch) parsedData.style = styleMatch[1].trim();
  if (toneMatch) parsedData.tone = toneMatch[1].trim();
  if (vocalStyleMatch) parsedData.vocalStyle = vocalStyleMatch[1].trim();
  if (accentsMatch) parsedData.accents = accentsMatch[1].trim();

  return parsedData;
}