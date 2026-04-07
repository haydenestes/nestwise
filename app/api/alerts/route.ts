/**
 * app/api/alerts/route.ts
 *
 * Alert delivery endpoint with frequency capping.
 *
 * Alert frequency caps:
 *   - daily       → max 1 alert per 24h   (86400s)
 *   - twice_daily → max 2 alerts per 24h  (43200s minimum gap)
 *   - instant     → max 4 alerts per 24h  (21600s minimum gap — prevents abuse)
 *
 * Supabase schema needed:
 *   profiles table:
 *     - alert_frequency  text  ('daily' | 'twice_daily' | 'instant')
 *     - last_alerted_at  timestamptz
 *
 *   SQL to add the columns if missing:
 *     ALTER TABLE profiles
 *       ADD COLUMN IF NOT EXISTS alert_frequency text NOT NULL DEFAULT 'daily',
 *       ADD COLUMN IF NOT EXISTS last_alerted_at timestamptz;
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabaseAdmin;
}

type AlertFrequency = 'daily' | 'twice_daily' | 'instant';

/** Minimum seconds between alerts for each frequency tier */
const MIN_INTERVAL_SECONDS: Record<AlertFrequency, number> = {
  daily: 86400,       // 24h
  twice_daily: 43200, // 12h
  instant: 21600,     // 6h (max 4/day, abuse prevention)
};

function isValidFrequency(f: string): f is AlertFrequency {
  return ['daily', 'twice_daily', 'instant'].includes(f);
}

/**
 * Check whether a user is eligible to receive an alert right now.
 * Returns { allowed: true } or { allowed: false, reason: string }.
 */
async function checkAlertEligibility(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const { data: profile, error } = await getSupabaseAdmin()
    .from('profiles')
    .select('alert_frequency, last_alerted_at')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    // If no profile found, allow the alert (fail open for new users)
    return { allowed: true };
  }

  const frequency: AlertFrequency = isValidFrequency(profile.alert_frequency)
    ? profile.alert_frequency
    : 'daily';

  const minIntervalSeconds = MIN_INTERVAL_SECONDS[frequency];

  if (profile.last_alerted_at) {
    const lastAlertedMs = new Date(profile.last_alerted_at).getTime();
    const nowMs = Date.now();
    const elapsedSeconds = (nowMs - lastAlertedMs) / 1000;

    if (elapsedSeconds < minIntervalSeconds) {
      const waitMins = Math.ceil((minIntervalSeconds - elapsedSeconds) / 60);
      return {
        allowed: false,
        reason: `Alert frequency cap reached (${frequency}). Try again in ~${waitMins} minute(s).`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Record that an alert was sent for this user (update last_alerted_at).
 */
async function recordAlertSent(userId: string): Promise<void> {
  await getSupabaseAdmin()
    .from('profiles')
    .update({ last_alerted_at: new Date().toISOString() })
    .eq('id', userId);
}

/**
 * POST /api/alerts
 * Body: { userId: string; listings?: object[] }
 *
 * Checks the user's alert frequency preference, enforces the cap,
 * and (when integrated with an email provider) sends the alert.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, listings } = body as { userId: string; listings?: object[] };

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Check eligibility
    const eligibility = await checkAlertEligibility(userId);
    if (!eligibility.allowed) {
      return NextResponse.json({ error: eligibility.reason, skipped: true }, { status: 429 });
    }

    // TODO: Integrate with your email provider (Resend, SendGrid, etc.)
    // e.g. await sendEmail({ to: user.email, subject: 'New matches', listings });

    // Record alert sent
    await recordAlertSent(userId);

    return NextResponse.json({
      success: true,
      message: `Alert sent to user ${userId}`,
      listingCount: listings?.length ?? 0,
    });
  } catch (err) {
    console.error('[alerts] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET /api/alerts?userId=xxx
 * Returns the user's current alert frequency setting and when they were last alerted.
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  const { data: profile, error } = await getSupabaseAdmin()
    .from('profiles')
    .select('alert_frequency, last_alerted_at')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const frequency: AlertFrequency = isValidFrequency(profile.alert_frequency)
    ? profile.alert_frequency
    : 'daily';

  const minInterval = MIN_INTERVAL_SECONDS[frequency];
  const lastAlertedMs = profile.last_alerted_at
    ? new Date(profile.last_alerted_at).getTime()
    : null;
  const nextAllowedAt = lastAlertedMs
    ? new Date(lastAlertedMs + minInterval * 1000).toISOString()
    : null;

  return NextResponse.json({
    alert_frequency: frequency,
    last_alerted_at: profile.last_alerted_at,
    next_allowed_at: nextAllowedAt,
    min_interval_seconds: minInterval,
  });
}
