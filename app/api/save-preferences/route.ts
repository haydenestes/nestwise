import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { email, criteria, notifications } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  // For now, just log and return success
  // TODO: Save to Supabase after auth setup
  console.log(`Saved preferences for ${email}:`, { criteria, notifications });

  return NextResponse.json({ success: true });
}
