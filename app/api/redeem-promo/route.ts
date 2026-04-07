import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name: string) => cookieStore.get(name)?.value } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  // Look up promo code
  const { data: promo, error } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .single();

  if (error || !promo) return NextResponse.json({ error: 'Invalid code' }, { status: 400 });

  // Check expiry
  if (new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ error: 'This code has expired' }, { status: 400 });
  }

  // Check max uses
  if (promo.max_uses !== null && promo.use_count >= promo.max_uses) {
    return NextResponse.json({ error: 'This code has reached its usage limit' }, { status: 400 });
  }

  // Set user trial status
  await supabase.from('profiles').upsert({
    id: user.id,
    status: 'trial',
    trial_ends_at: promo.trial_ends_at,
  });

  // Increment use count
  await supabase
    .from('promo_codes')
    .update({ use_count: (promo.use_count || 0) + 1 })
    .eq('code', promo.code);

  return NextResponse.json({ success: true, trial_ends_at: promo.trial_ends_at });
}
