'use server'

import OpenAI from "openai";
const openai = new OpenAI();

export default async function generateSongDetails(songIdea: string): Promise<AISuggestions> {
    /*try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a songwriting assistant tasked with generating comprehensive song details based on the user's idea. Provide a proposed style, influences, tone, vocal style, and accents for the song." },
                { role: "user", content: `Based on the following song idea, generate a proposed style, influences, tone, vocal style, and accents: ${songIdea}` },
            ],
        });

        const messageContent = completion.choices[0].message;
        return {
            role: messageContent.role,
            content: messageContent.content || "No details generated",
            refusal: null,
        };
    } catch (error) {
        console.error("Error generating song details:", error);
        return {
            role: "system",
            content: "Error generating song details",
            refusal: null,
        };
    }*/
   const mockData = {
    "role": "assistant",
    "content": "Style: Power Ballad/Pop Rock\n\nInfluences: The song takes inspiration from the empowering music of artists such as Journey, Bruce Springsteen, Queen, Rachel Platten, and Sia.\n\nTone: The song will carry an empowering and motivational tone, touching on themes of perseverance, overcoming adversity, and personal growth. The verses will have a darker tone to depict the struggle, switching to triumphant and uplifting in the chorus to demonstrate victory and resilience.\n\nVocal Style: The vocals should be robust and dynamic, versatile enough to capture the softer moments of struggle but powerful and fearless when representing triumph. The vocal style would embody characteristics of great rock/pop powerhouses like Freddie Mercury or Kelly Clarkson.\n\nAccents: For the instrumental accents, it would include soaring guitar solos or complementary string sections that emphasize the highs and lows of the protagonist's journey. Piano undertones can also be used to add a layer of depth and introspection. For vocal accents, we'll use belting, emphasizing key words and phrases to underline the protagonist's determination and strength. Adding backing vocals or choir elements during the choruses will reinforce the feeling of triumphant resilience.",
    "refusal": null
   }
    return mockData;
}


export async function generateLyrics(songIdea: string, 
  style?: string,
  tone?: string,
  vocalStyle?: string,
  accents?: string,
): Promise<AISuggestions> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a songwriting assistant tasked with generating lyrics based on the user's song idea and song details. Provide a full lyrics for this song." },
        { role: "user", content: `Based on the following song idea and details, generate a lyrics: ${songIdea}` },
        { role: "assistant", content: `Style: ${style}\n\nTone: ${tone}\n\nVocal Style: ${vocalStyle}\n\nAccents: ${accents}` },
      ],
    });
    return {
      role: "assistant",
      content: completion.choices[0].message.content || "No lyrics generated",
      refusal: null,
    };
    }
    catch (error) {
    console.error("Error generating lyrics:", error);
    return {
      role: "system",
      content: "Error generating lyrics",
      refusal: null,
    };
    }
  }
