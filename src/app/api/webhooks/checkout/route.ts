import { getServerAuthSession } from "@/next-auth/next-auth-options";
import { stripe } from "@/utils/stripe/config";
import Stripe from "stripe";
import {prisma} from "@/lib/prisma";
const relevantEvents = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.async_payment_intent_succeeded",
  "checkout.session.async_payment_intent_failed",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.TEST_STRIPE_SECRET_WEBHOOK_KEY;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response("Webhook secret not found.", { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntent =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null;

        if (paymentIntent) {
          const findUser = await prisma.user.findUnique({
            where: {
              email: session.customer_details?.email ?? "",
            },
          });
          console.log("findUser", findUser);
          const userIdDatabase = findUser?.id
          await prisma.userPayment.create({
            data: {
              userId: userIdDatabase ?? "",
              currency: session.currency ?? "",
              paymentIntent: paymentIntent,
              userCountry: session.customer_details?.address?.country ?? "",
              userEmail: session.customer_details?.email ?? "",
              userName: session.customer_details?.name ?? "",
              amount: session.amount_total ?? 0, // Ensure amount is set and correct
            },
          });
        } else {
          console.error("PaymentIntent is null or not a string");
          return new Response("Invalid PaymentIntent", { status: 400 });
        }

        return new Response("Webhook received", { status: 200 });
      }
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  }
  
  return new Response("Webhook received", { status: 200 });
}
