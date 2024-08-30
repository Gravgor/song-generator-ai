'use server'

import { User } from "@/types/User";
import bcrypt from "bcrypt";
import OpenAI from "openai";
import {prisma} from "@/lib/prisma";
import { loadStripe } from "@stripe/stripe-js";
import { AISuggestions, SongCreationFormValues } from "@/types/SongCreation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const openai = new OpenAI();

export default async function generateSongDetails(songIdea: string): Promise<AISuggestions> {
   try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a songwriting assistant tasked with generating comprehensive song details based on the user's idea. Provide a proposed style, influences, tone, vocal style, and accents for the song. Your answer should have only Style, Infulences, Tone, Vocal style, Accents - nothing more." },
                { role: "user", content: `Based the following song idea, recommend musical influences or artists that would inspire the style and composition of this track. Keep it concise like Artist 1, Artist 2, Artist 3: ${songIdea}, Based on the following idea and influences, suggest the most fitting musical genre (or genre mix that would best convey the essence of the song. Keep it concise like Genre 1 (Genre 2 fusion, if necessary), Based on the following idea, the genre and influences, what should the emotional tone of the song be to best reflect the theme? Should it be upbeat, reflective, romantic, etc.? Keep it concise like Tone 1, Tone 2, Considering the following idea, genre, influences, and tone, what vocal style would be most appropriate for this song? Should it be soulful, energetic, soft, etc.? Male/Female? Include vocal accent also, Should it be British, American, Indian, etc.? Keep it concise like: {Tone} {Gender} with a {Accent} accent. ` },
            ],
        });

        const messageContent = completion.choices[0].message;
        console.log(messageContent)
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
    }
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
  influences?: string,
): Promise<AISuggestions> {
  try {
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a songwriting assistant tasked with generating lyrics based on the user's song idea and song details. Provide a full lyrics for this song." },
        { role: "user", content: `Based on the following idea and style factors, generate full-length 2000-character-long song lyrics and also title of the song that seamlessly integrate these elements. The lyrics should be fluid and cohesive, without any verse, chorus, outro titles or text formatting. Ensure the tone, vocal style, and overall vibe are consistent throughout, reflecting the specified genre, influences, and accent: ${songIdea}` },
        { role: "assistant", content: `Style: ${style}\n\nTone: ${tone}\n\nVocal Style: ${vocalStyle}\n\nInfluences: ${influences}` },
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
   const mockData = {
    "role": "assistant",
    "content": "Verse 1:\n\nIn the dead of night, when the stars align\n\nI see the fire burning in your eyes\n\nThe shadows fall, but you stand tall\n\nYou're the light that guides me through it all\n\nChorus:\n\nRise from the ashes, rise from the flames\n\nWe'll be stronger than we ever were before\n\nTogether we'll stand, hand in hand\n\nWe'll rise from the ashes, rise from the flames\n\nVerse 2:\n\nThrough the darkest days, through the coldest nights\n\nWe'll be the ones who shine the brightest light\n\nWe'll face the storm, we'll brave the fight\n\nWe'll be the ones who rise into the light\n\nChorus:\n\nRise from the ashes, rise from the flames\n\nWe'll be stronger than we ever were before\n\nTogether we'll stand, hand in hand\n\nWe'll rise from the ashes, rise from the flames\n\nBridge:\n\nWhen the world is falling apart\n\nWe'll be the ones who'll mend the broken hearts\n\nWe'll be the ones who'll light the spark\n\nWe'll be the ones who'll rise from the dark\n\nChorus:\n\nRise from the ashes, rise from the flames\n\nWe'll be stronger than we ever were before\n\nTogether we'll stand, hand in hand\n\nWe'll rise from the ashes, rise from the flames\n\nOutro:\n\nWe'll rise from the ashes, rise from the flames\n\nWe'll be stronger than we ever were before\n\nTogether we'll stand, hand in hand\n\nWe'll rise from the ashes, rise from the flames\n\n",
    "refusal": null
   }
    return mockData;
  }









export async function authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if(!user) {
        throw new Error("User not found");
    }
    const passwordValid = bcrypt.compare(password, user.password || '');
    if (!passwordValid) {
        throw new Error("Invalid password");
    }
    return user as unknown as User;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });
    return user as unknown as User;
}

export async function createGoogleUser(email: string, username: string): Promise<User> {
    const user = await prisma.user.create({
        data: {
            email,
            username,
        },
    });
    return user as unknown as User;
}


export async function getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user as unknown as User;
}
