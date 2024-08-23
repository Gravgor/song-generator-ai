'use server'

import { User } from "@/types/User";
import bcrypt from "bcrypt";
import OpenAI from "openai";
import {prisma} from "@/lib/prisma";
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
    /*
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a songwriting assistant tasked with generating lyrics based on the user's song idea and song details. Provide a full lyrics for this song." },
        { role: "user", content: `Based on the following song idea and details, generate a lyrics: ${songIdea}` },
        { role: "assistant", content: `Style: ${style}\n\nTone: ${tone}\n\nVocal Style: ${vocalStyle}\n\nAccents: ${accents}` },
      ],
    });*/
    return {
      role: "assistant",
      content: JSON.stringify(`**Title: Rise From the Ashes**

**Verse 1:**
In the shadows where I linger,
Wounds are deep, they cut like knives,
A heart once bright, now feels like winter,
But I’m more than just my scars, I’m alive.

**Pre-Chorus:**
I’ve walked through fires, faced my fears,
Fallen hard, drowned in tears,
But every whisper of despair,
Turns to strength when I declare...

**Chorus:**
I’m gonna rise from the ashes,
Like a phoenix in the sky,
No more chains, no more crashes,
Watch me soar, watch me fly.
I won't back down, I won’t surrender,
With every breath, I’m breaking free,
This is my time, my heart's a warrior,
I’ll be the light that you can see.

**Verse 2:**
Storms may rage, but I’ll keep walking,
With every step, I’m reclaiming me,
Through the silence, I hear my calling,
In the wreckage, I find my peace.

**Pre-Chorus:**
These broken dreams won't hold me back,
I’ll rebuild from all the cracks,
With every shatter, I’ll reframe,
Rising stronger, feel the flame…

**Chorus:**
I’m gonna rise from the ashes,
Like a phoenix in the sky,
No more chains, no more crashes,
Watch me soar, watch me fly.
I won't back down, I won’t surrender,
With every breath, I’m breaking free,
This is my time, my heart's a warrior,
I’ll be the light that you can see.

**Bridge:**
Now I stand with scars as my crown,
Every bruise, a story profound,
I’m the warrior, I’m the dreamer,
With a fire that burns forever brighter.

**Chorus:**
I’m gonna rise from the ashes,
Like a phoenix in the sky,
No more chains, no more crashes,
Watch me soar, watch me fly.
I won't back down, I won’t surrender,
With every breath, I’m breaking free,
This is my time, my heart's a warrior,
I’ll be the light that you can see.

**Outro:**
So here I am, standing tall,
No more shadows, I’ve conquered it all,
With the strength of a thousand hearts,
I’ll rise, I’ll shine, I’ve made a new start.
I’ll rise from the ashes, watch me fly,
I’m unstoppable, reaching high`),
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




  export async function handlePaymentAndSongGeneration(data : SongCreationFormValues) {
    const apiKey = process.env.GOAPI_API_KEY;
    console.log(apiKey)
    /*const request = await fetch(`${process.env.GOAPI_URL}`,{
      method: "POST",
      body: JSON.stringify({
        "custom_mode": true,
        "input": {
          "prompt": data.lyrics,
          "title": "Rise From the Ashes",
          "tags": data.style,
          "continue_at": 0,
          "continue_clip_id": "" 
        }
      }),
      headers: {
        "X-API-Key": `${apiKey}`,
        "Content-Type": "application/json"
      }
    })
    const response = await request.json()
    const taskID = "7f38a240-64b5-4c52-884a-67185b78af47"
    const taskRequest = await fetch(`${process.env.GOAPI_URL}/${taskID}`,{
      headers: {
        "X-API-Key": `${apiKey}`,
        "Content-Type": "application/json"
      }
    })
    const taskResponse = await taskRequest.json()*/
    const taskResponse = {
      clips: {
        "url": "https://cdn1.suno.ai/a4cde422-810a-4835-9464-8c05034bc6a4.mp3"
      }
    }
    console.log(taskResponse)
    return taskResponse
}


export async function authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma?.user.findUnique({
        where: {
            email,
        },
    });
    if(!user) {
        throw new Error("User not found");
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
        throw new Error("Invalid password");
    }
    return user as unknown as User;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma?.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    });
    return user as unknown as User;
}