'use client';
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .legal-root { min-height: 100vh; background: #0e0c0a; color: #f0ebe0; font-family: 'Inter', sans-serif; padding: 0 0 80px; }
        .legal-nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 48px; border-bottom: 1px solid rgba(240,235,224,0.07); }
        .legal-logo { font-size: 13px; font-weight: 500; letter-spacing: 0.18em; color: #c9a84c; text-transform: uppercase; text-decoration: none; }
        .legal-body { max-width: 760px; margin: 0 auto; padding: 56px 24px 0; }
        .legal-eyebrow { font-size: 10px; letter-spacing: 0.22em; color: #c9a84c; text-transform: uppercase; margin-bottom: 12px; }
        .legal-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 40px; font-weight: 300; color: #f0ebe0; margin-bottom: 8px; }
        .legal-updated { font-size: 12px; color: rgba(240,235,224,0.35); margin-bottom: 48px; }
        .legal-body h2 { font-size: 16px; font-weight: 500; color: #c9a84c; letter-spacing: 0.04em; margin: 40px 0 12px; }
        .legal-body p { font-size: 14px; line-height: 1.75; color: rgba(240,235,224,0.75); margin-bottom: 14px; }
        .legal-body ul { margin: 0 0 14px 20px; }
        .legal-body ul li { font-size: 14px; line-height: 1.75; color: rgba(240,235,224,0.75); margin-bottom: 6px; }
        .attorney-note { background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.25); border-radius: 6px; padding: 12px 16px; margin: 16px 0; font-size: 12px; color: #c9a84c; }
        .legal-divider { border: none; border-top: 1px solid rgba(240,235,224,0.07); margin: 32px 0; }
      `}</style>

      <div className="legal-root">
        <nav className="legal-nav">
          <Link href="/" className="legal-logo">Nestwise</Link>
          <Link href="/signin" style={{ fontSize: '13px', color: 'rgba(240,235,224,0.5)', textDecoration: 'none' }}>Sign in</Link>
        </nav>

        <div className="legal-body">
          <div className="legal-eyebrow">Legal</div>
          <div className="legal-title">Privacy Policy</div>
          <div className="legal-updated">Last updated: March 30, 2026</div>

          <p>Nestwise (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights — including your rights under the California Consumer Privacy Act (CCPA).</p>

          <h2>1. Information We Collect</h2>
          <p><strong>Information you provide:</strong></p>
          <ul>
            <li>Name and email address (at signup)</li>
            <li>Search criteria (neighborhoods, budget, bedroom count, pet preferences, amenities)</li>
            <li>Renter profile information (income range, credit range, move-in date, pets) — if you choose to provide it</li>
            <li>Payment information (processed by Stripe; we do not store card numbers)</li>
          </ul>
          <p><strong>Information collected automatically:</strong></p>
          <ul>
            <li>Browser type, operating system, and device information</li>
            <li>Pages visited and features used on Nestwise</li>
            <li>IP address and approximate location</li>
            <li>Session data and cookies</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide the Nestwise service — matching listings to your criteria and sending alerts</li>
            <li>To process payments via Stripe</li>
            <li>To send listing alert emails you have opted into</li>
            <li>To improve and debug the platform</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p>We do not sell your personal information to third parties. We do not use your data for advertising.</p>

          <h2>3. Third-Party Services</h2>
          <p>Nestwise uses the following third-party services which may process your data under their own privacy policies:</p>
          <ul>
            <li><strong>Supabase</strong> — authentication and database (supabase.com/privacy)</li>
            <li><strong>Stripe</strong> — payment processing (stripe.com/privacy)</li>
            <li><strong>Vercel</strong> — hosting and deployment (vercel.com/legal/privacy-policy)</li>
          </ul>
          <p>We do not share your personal information with listing sources (Craigslist, Chandler Properties, etc.).</p>

          <h2>4. Email Communications</h2>
          <p>If you subscribe to listing alerts, we will send you emails based on your notification preferences. You can update your preferences or unsubscribe at any time from your account settings or by emailing us. We do not send marketing emails without your consent.</p>

          <h2>5. Data Retention</h2>
          <p>We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law or for fraud prevention purposes.</p>

          <h2>6. Security</h2>
          <p>We use industry-standard security practices including encrypted connections (HTTPS), secure authentication via Supabase, and payment processing via Stripe (PCI-DSS compliant). However, no system is perfectly secure — we cannot guarantee absolute security of your data.</p>

          <h2>7. California Privacy Rights (CCPA)</h2>
          <p>If you are a California resident, you have the following rights:</p>
          <ul>
            <li><strong>Right to Know</strong> — you may request a summary of what personal information we have collected about you</li>
            <li><strong>Right to Delete</strong> — you may request deletion of your personal information</li>
            <li><strong>Right to Opt Out</strong> — we do not sell personal information, so no opt-out is needed</li>
            <li><strong>Right to Non-Discrimination</strong> — we will not discriminate against you for exercising your rights</li>
          </ul>
          <p>To exercise any of these rights, contact us at the email below. We will respond within 45 days.</p>
          <div className="attorney-note">⚠️ Attorney review recommended: If annual gross revenue exceeds $25M, or you process data of 100,000+ consumers/year, additional CCPA obligations may apply. Consider a formal CCPA compliance review.</div>

          <h2>8. Children&apos;s Privacy</h2>
          <p>Nestwise is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe we have done so, contact us immediately and we will delete the information.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or by posting a notice on the site. Continued use of Nestwise after changes constitutes acceptance.</p>

          <h2>10. Contact Us</h2>
          <p>For privacy requests, questions, or concerns:<br />
          <strong>Nestwise</strong><br />
          San Francisco, CA<br />
          Email: <a href="mailto:hello@nestwise-sf.com" style={{ color: '#c9a84c' }}>hello@nestwise-sf.com</a></p>

          <hr className="legal-divider" />
          <p style={{ fontSize: '12px', color: 'rgba(240,235,224,0.3)' }}>
            <em>This document was drafted with AI assistance and is not a substitute for advice from a licensed attorney. Nestwise recommends having this policy reviewed by a California-licensed attorney before accepting paying users.</em>
          </p>
        </div>
      </div>
    </>
  );
}
