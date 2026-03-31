import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json().catch(() => ({}));

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nestwise-sf.vercel.app'}/dashboard?subscribed=true`,
      cancel_url:  `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nestwise-sf.vercel.app'}/criteria?cancelled=true`,
      metadata: { source: 'nestwise-sf' },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
