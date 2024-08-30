import { getServerSession } from "next-auth/next"
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { authOptions } from "@/next-auth/next-auth-options"

export async function verifySession(request?: NextRequestWithAuth) {
  if (request) {
    // This is being called from middleware
    return withAuth(
      function middleware(req) {
        return NextResponse.next()
      },
      {
        callbacks: {
          authorized: async ({ req }) => {
            const token = await getToken({ req })
            return !!token
          }
        },
      }
    )
  } else {
    // This is being called from a server action or API route
    const session = await getServerSession(authOptions)
    return !!session
  }
}