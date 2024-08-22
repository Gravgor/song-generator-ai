

export   const parseAIResponse = (response: string) => {
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
  