import { getServerAuthSession } from "@/next-auth/next-auth-options";
import { verifySession } from "../auth";
import { loadStripe } from "@stripe/stripe-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function protectedCheckOutStripe(priceId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const apiKey = process.env.PUBLIC_STRIPE_PUBLIC_KEY
    if(!apiKey) {
      throw new Error("Stripe public key not found")
    }
    const stripe = await loadStripe(apiKey)
    if(!stripe) {
      throw new Error("Stripe not loaded")
    }
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        body: JSON.stringify({ priceId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const session = await response.json()
      if(!session) {
        throw new Error("No session returned")
      }
      const result = await stripe.redirectToCheckout({
        sessionId: session.result.id,
      })
    } catch (error) {
      console.error("Error checking out with Stripe:", error)
    }
  }
  
  
  
  export async function protectedGetLatestPayment(userId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const latestPayment = await prisma?.userPayment.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  
    return {
      success: true,
      payment: latestPayment,
    };
  }
  
  export async function redirectAfterPayment() {
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }
  
  