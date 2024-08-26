import { getServerAuthSession } from "@/next-auth/next-auth-options";
import { stripe } from "@/utils/stripe/config";
import Stripe from "stripe";


const relevantEvents = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.completed",
  "checkout.session.async_payment_intent_succeeded",
  "checkout.session.async_payment_intent_failed",
  "checkout.session.async_payment_intent_succeeded",
  "checkout.session.async_payment_intent_failed",
])

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.TEST_STRIPE_SECRET_WEBHOOK_KEY;
  const serverSession = await getServerAuthSession();
  const userIdSession = serverSession?.user?.id;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if(relevantEvents.has(event.type)) {
    try {
      if(event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const payment = prisma?.userPayment.create({
          userId: userIdSession,
         currency: session.currency,
        paymentIntentId: session.payment_intent,
        userCountry: session.customer_details?.address?.country,
        userEmail: session.customer_details?.email,
        userName: session.customer_details?.name,
        amout: session.amount_total,
      })
      return new Response('Webhook received', { status: 200 });
      }
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  }
  return new Response('Webhook received', { status: 200 });
}