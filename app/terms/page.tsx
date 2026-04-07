'use client';
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
        
        .legal-divider { border: none; border-top: 1px solid rgba(240,235,224,0.07); margin: 32px 0; }
      `}</style>

      <div className="legal-root">
        <nav className="legal-nav">
          <Link href="/" className="legal-logo">Nestwise</Link>
          <Link href="/signin" style={{ fontSize: '13px', color: 'rgba(240,235,224,0.5)', textDecoration: 'none' }}>Sign in</Link>
        </nav>

        <div className="legal-body">
          <div className="legal-eyebrow">Legal</div>
          <div className="legal-title">Terms of Service</div>
          <div className="legal-updated">Last updated: March 30, 2026</div>

          <p>Please read these Terms of Service carefully before using Nestwise. By creating an account or using our service, you agree to be bound by these terms. If you do not agree, do not use Nestwise.</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using Nestwise (&ldquo;the Service&rdquo;), you agree to these Terms of Service and our <Link href="/privacy" style={{ color: '#c9a84c' }}>Privacy Policy</Link>. These terms apply to all users, including visitors, registered users, and paying subscribers. We may update these terms at any time — continued use after changes constitutes acceptance.</p>

          <h2>2. What Nestwise Is (and Isn&apos;t)</h2>
          <p>Nestwise is a <strong>rental listing aggregation platform</strong>. We collect and display rental listings from publicly available third-party sources and present them in one place based on your search criteria.</p>
          <p>Nestwise is <strong>not</strong>:</p>
          <ul>
            <li>A licensed real estate broker or agent</li>
            <li>A landlord or property manager</li>
            <li>A party to any rental agreement between you and a landlord</li>
            <li>An affiliate of Zillow, Redfin, Craigslist, Apartments.com, or any other listing platform</li>
          </ul>
          <p>We do not list properties ourselves, negotiate leases, or guarantee any housing outcome.</p>

          <h2>3. Listing Accuracy Disclaimer</h2>
          <p>Listings displayed on Nestwise are sourced from third parties. We make no representations or warranties — express or implied — regarding the accuracy, completeness, availability, or legality of any listing. Listing details including price, availability, pet policies, and amenities may be outdated or incorrect by the time you view them.</p>
          <p><strong>Always verify listing details directly with the landlord or property manager before taking any action.</strong></p>

          <h2>6. Third-Party Content &amp; Trademarks</h2>
          <p>Nestwise displays content sourced from third-party platforms. All trademarks, service marks, and trade names referenced on Nestwise (including Zillow®, Redfin®, Craigslist®, and Apartments.com®) are the property of their respective owners. Nestwise is not affiliated with, endorsed by, or sponsored by any of these companies.</p>

          <h2>6a. Fraudulent, Scam, and Phishing Listings</h2>
          <p>Nestwise aggregates listings from third-party sources including Craigslist and property management websites. <strong>We do not verify the authenticity, legitimacy, or accuracy of any listing.</strong> Fraudulent, scam, and phishing listings — including fake rentals designed to collect personal information or payments — may appear on third-party platforms and may be inadvertently surfaced by Nestwise.</p>
          <p><strong>Nestwise is not responsible for fraudulent listings originating from third-party sources.</strong> We expressly disclaim all liability for any harm, financial loss, identity theft, or damages resulting from a user interacting with a fraudulent or scam listing displayed on our platform.</p>
          <p>To protect yourself:</p>
          <ul>
            <li>Never wire money, send gift cards, or pay a deposit before viewing a property in person</li>
            <li>Never provide personal financial information (SSN, bank account numbers) to unverified landlords</li>
            <li>Be cautious of listings priced significantly below market rate — this is a common scam indicator</li>
            <li>Verify the landlord&apos;s identity and ownership of the property before signing any agreement</li>
            <li>Report suspected scam listings to us at <a href="mailto:hello@nestwise-sf.com" style={{ color: '#c9a84c' }}>hello@nestwise-sf.com</a> and to the source platform directly</li>
          </ul>
          <p>If you believe you have encountered a fraudulent listing on Nestwise, contact us immediately. We will remove it from our platform upon verification. However, removal does not create liability on our part for any prior interactions with that listing.</p>

          <h2>9. Intellectual Property</h2>
          <p>Nestwise owns all rights to its platform, including but not limited to: the user interface design, neighborhood tier ratings, match-scoring algorithm, proprietary data compilations, and all original written content. You may not copy, reproduce, or distribute any part of the Nestwise platform without written permission.</p>
          <p>Third-party listing data displayed on Nestwise remains the property of its original sources.</p>

          <h2>10. Account Termination</h2>
          <p>You may cancel your account at any time. We reserve the right to suspend or terminate your account without notice if you violate these terms, engage in fraudulent activity, or if we discontinue the service. No refunds are provided for partial subscription periods unless required by law.</p>

          <h2>11. Binding Arbitration &amp; Class Action Waiver</h2>
          <p>Any dispute arising from or relating to these Terms or your use of Nestwise will be resolved by binding individual arbitration administered by JAMS under its Streamlined Arbitration Rules, not by a court. <strong>You waive your right to a jury trial and to participate in any class action.</strong> Arbitration will take place in San Francisco, California.</p>
      </div>
    </>
  );
}
