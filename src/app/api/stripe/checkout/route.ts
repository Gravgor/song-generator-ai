import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const priceId = data.priceId;
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_BASE_URL}/create-song`,
            cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
            metadata: {
                userId: data.userId,
            }
        });
        return NextResponse.json({result: session, ok: true});
    } catch (error) {
        console.error(error);
        return NextResponse.json({result: error, ok: false});
    }
}