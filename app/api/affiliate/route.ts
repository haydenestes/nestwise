import { NextResponse } from 'next/server';

// Track affiliate signup: called when a new paid user signs up via an affiliate link
// URL format: nestwise-sf.vercel.app/signup?aff=AFFCODE
export async function POST(req: Request) {
  try {
    const { affiliateCode, newUserEmail } = await req.json();
    if (!affiliateCode || !newUserEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Record the conversion
    const { error } = await supabase
      .from('affiliate_conversions')
      .insert({
        affiliate_code: affiliateCode,
        new_user_email: newUserEmail,
        payout_amount: 10.00,
        status: 'pending', // pending → paid when you manually pay out
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Get affiliate stats for a given code
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('affiliate_conversions')
    .select('*')
    .eq('affiliate_code', code);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const total = data.length;
  const earned = data.reduce((sum, r) => sum + (r.payout_amount || 0), 0);
  const pending = data.filter(r => r.status === 'pending').length;

  return NextResponse.json({ code, total_signups: total, total_earned: earned, pending_payouts: pending });
}
