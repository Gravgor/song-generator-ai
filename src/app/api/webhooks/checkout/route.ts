

import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { headers } from 'next/headers';
type METADATA = {
  userId: string;
  priceId: string;
};
import { buffer } from "micro"
const stripe = new Stripe(process.env.PROD_STRIPE_SECRET_KEY!);

export async function POST(req: any) {
  if(req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
    const body = await buffer(req);
    const endpointSecret = process.env.PROD_STRIPE_SECRET_WEBHOOK_KEY!;
    const sig = req.headers.get('stripe-signature') as string;
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(body.toString(), sig, endpointSecret);
    } catch (err) {
        console.error(err);
        return new Response('Webhook Error', { status: 400 });
    }
    const eventType = event.type;
  if (
    eventType !== 'checkout.session.completed' &&
    eventType !== 'checkout.session.async_payment_succeeded'
  )
    return new Response('Server Error', {
      status: 500
    });
    const data = event.data.object;
  const metadata = data.metadata as METADATA;
  const userId = metadata.userId;
  const priceId = metadata.priceId;
  const created = data.created;
  const currency = data.currency;
  const customerDetails = data.customer_details;
  const amount = data.amount_total;
  const transactionDetails = {
    userId,
    priceId,
    created,
    currency,
    customerDetails,
    amount,
  };
  try {
    // Handle the checkout.session.completed event
    // Fulfill the purchase...
    // Send a confirmation email...
    // You can write your own custom logic here
    console.log('Payment succeeded:', transactionDetails);
    return new Response('Webhook Received: Success', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response('Webhook Error', { status: 400 });
  }
}