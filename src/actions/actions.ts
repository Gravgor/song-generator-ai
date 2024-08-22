'use server'
// OPEN AI
import OpenAI from "openai"
const openai = new OpenAI()


export default async function generateLyrics(songTitle: string, songIdea: string): Promise<AISuggestions> {
    /*try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a songwriter who will generate lyrics, style of song, and title based on the user song idea." },
          { role: "user", content: songIdea },
        ],
      });
      const messageContent = completion.choices[0].message;
      return {
        role: messageContent.role,
        content: messageContent.content || "No lyrics generated",
        refusal: null,
      }
  } catch (error) {
     console.error("Error generating lyrics:", error);
        return {
        role: "system",
        content: "Error generating lyrics",
        refusal: null,
        };
  }*/
        const mockAIResponse: AISuggestions = {
            role: 'assistant',
            content: `**Title:** "High Above the Hustle"
          
            **Style:** Indie Pop with R&B Influences
          
            ---
          
            **Verse 1:**  
            City lights flicker, hearts race in the glow,  
            Chasing dreams through the neon, but will they ever show?  
            Champagne toasting, laughter fills the air,  
            But behind the masks, do they really care?  
          
            **Pre-Chorus:**  
            I see the highs, but I feel the lows,  
            In the shadows of the glitz, my true self grows.  
            It's a fine line between the night and day,  
            Cuz success wears a crown, but it can’t feel the same way.  
          
            **Chorus:**  
            High above the hustle, I’m fighting through the doubt,  
            In the spin of the city, I scream and I shout.  
            Glimmer and glamour, they're a fleeting façade,  
            But I’ll hold my ground, standing tall against the odds.  
          
            **Verse 2:**  
            Late-night grind, coffee steaming in a cup,  
            Every sip's a promise, I won’t ever give up.  
            The street's a stage, but I’m playing my part,  
            With whispers of wisdom tucked deep in my heart.  
          
            **Pre-Chorus:**  
            I hear the cheers, yet I feel the falls,  
            In the echoes of ambition, I’ll answer the calls.  
            It's a battle inside, but I wear my scars,  
            Cuz resilience is gold, even under the stars.  
          
            **Chorus:**  
            High above the hustle, I’m fighting through the doubt,  
            In the spin of the city, I scream and I shout.  
            Glimmer and glamour, they're a fleeting façade,  
            But I’ll hold my ground, standing tall against the odds.  
          
            **Bridge:**  
            When the night fades and the dawn breaks clear,  
            I’ll stand in the stillness wiping away every tear.  
            Authentic and real, through the flashing lights,  
            I’ll walk the line of my dreams, chasing truth in the night.  
          
            **Chorus:**  
            High above the hustle, I’m fighting through the doubt,  
            In the spin of the city, I scream and I shout.  
            Glimmer and glamour, they're a fleeting façade,  
            But I’ll hold my ground, standing tall against the odds.  
          
            **Outro:**  
            So here’s to the dreamers, the ones who stay true,  
            In a world of shadows, let your light shine through.  
            High above the hustle, we’ll rise and reclaim,  
            With integrity intact, I’ll forever stake my name.  
          
            ---
          
            Feel free to adapt any part of these lyrics to better fit your vision!`,
            refusal: null
        };
        return mockAIResponse;
}