

export const parseAILyrics = (response: string) => {
    const titleMatch = response.match(/\*\*Title:\*\*\s*"([^"]*)"/);
  
    const styleMatch = response.match(/\*\*Style:\*\*\s*([^\n]+)(?=\s*---)/);
  
    const lines = response.split('\n');
    console.log("Lines:", lines);
  
    const lyricsStartIndex = lines.findIndex(line => line.trim().startsWith('**Verse 1:**')) + 1;
    const lyricsEndIndex = lines.findIndex(line => line.trim().startsWith('**Outro:**'));
  
    const lyricsLines = lyricsEndIndex === -1 ? lines.slice(lyricsStartIndex) : lines.slice(lyricsStartIndex, lyricsEndIndex);
  
    const lyrics = lyricsLines
      .filter(line => !line.trim().startsWith('**'))
      .join('\n')
      .trim();
  
    return {
      title: titleMatch ? titleMatch[1] : "",
      style: styleMatch ? styleMatch[1].trim() : "",
      lyrics: lyrics,
    };
  };
  

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