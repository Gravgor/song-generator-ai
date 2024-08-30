'use server';
import { getServerAuthSession } from "@/lib/auth";
import { verifySession } from "../auth";
import { loadStripe } from "@stripe/stripe-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { stripe } from "@/utils/stripe/config";

  
  
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
      payment: latestPayment?.paymentIntent,
    };
  }

  export async function waitForPaymentConfirmation(paymentIntent: string, maxAttempts: number = 30) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const payment = await protectedCheckPaymentStatus(paymentIntent);
      console.log(payment)
      if (payment.status === "succeeded") {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  }


  export async function protectedCheckPaymentStatus(paymentIntent: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
        throw new Error("User is not authenticated");
    }
    const payment = await stripe.paymentIntents.retrieve(paymentIntent);
    if (!payment) {
      throw new Error("Payment intent not found");
    }
    return { status: payment.status };
  }


  export async function protectedGetStripePayment(userId: string) {
    const isAuthenticated = await verifySession();
    if (!isAuthenticated) {
      throw new Error("User is not authenticated");
    }
    const payment = await prisma?.userPayment.findFirst({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return payment;
  }
  
  export async function redirectAfterPayment() {
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }
  
  