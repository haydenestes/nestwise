-- Promo codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  code text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  trial_ends_at timestamptz NOT NULL,
  max_uses integer DEFAULT NULL,
  use_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Insert DAISY2026
INSERT INTO promo_codes (code, expires_at, trial_ends_at)
VALUES ('DAISY2026', '2026-05-31T23:59:59Z', '2026-05-31T23:59:59Z')
ON CONFLICT (code) DO NOTHING;

-- Add trial fields to users table (profiles or users — check which exists)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status text DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;
