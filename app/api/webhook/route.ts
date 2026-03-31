import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig  = req.headers.get('stripe-signature') ?? '';
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' });

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err) {
      return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as { customer_email?: string; metadata?: Record<string, string> };
      const email = session.customer_email || session.metadata?.email;

      if (email) {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_KEY!
        );

        // Create the Supabase auth user
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
        const { data: userData, error: createError } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
        });

        if (createError && createError.message !== 'User already registered') {
          console.error('Create user error:', createError);
          return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        const userId = userData?.user?.id;
        if (userId) {
          // Mark as paid in profiles
          await supabase.from('profiles').upsert({
            id: userId,
            email,
            subscription_status: 'active',
          });
        }

        // TODO: send "finish your account" email via Python scraper or SendGrid
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
