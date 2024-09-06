"use server"

import { prisma } from "@/lib/prisma";

export async function getAllAccessSongs() {
    const songs = await prisma.clip.findMany()
    return songs
}