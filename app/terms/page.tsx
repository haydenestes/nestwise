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
          <div className="attorney-note">⚠️ Attorney review recommended: Consider whether additional disclaimer language is needed for your specific scraping sources and whether any data licensing agreements apply.</div>

          <h2>4. No Real Estate License</h2>
          <p>Nestwise does not hold a California real estate license and does not provide real estate advice, brokerage services, or legal counsel. Nothing on this platform constitutes a representation, warranty, or guarantee regarding any property. No landlord-tenant relationship is created between Nestwise and any user.</p>

          <h2>5. Fair Housing Compliance</h2>
          <p>Nestwise is committed to fair housing. We do not discriminate in the provision of services based on race, color, national origin, religion, sex, familial status, disability, sexual orientation, gender identity, source of income, or any other characteristic protected by federal, state, or local law, including the Fair Housing Act (42 U.S.C. §3604) and the California Fair Employment and Housing Act.</p>
          <p>Users of Nestwise are also required to comply with all applicable fair housing laws.</p>
          <div className="attorney-note">⚠️ Attorney review recommended: If your scoring algorithm incorporates neighborhood data, ensure the scoring criteria do not have discriminatory effects under disparate impact theory.</div>

          <h2>6. Third-Party Content &amp; Trademarks</h2>
          <p>Nestwise displays content sourced from third-party platforms. All trademarks, service marks, and trade names referenced on Nestwise (including Zillow®, Redfin®, Craigslist®, and Apartments.com®) are the property of their respective owners. Nestwise is not affiliated with, endorsed by, or sponsored by any of these companies.</p>

          <h2>7. User Conduct</h2>
          <p>By using Nestwise, you agree not to:</p>
          <ul>
            <li>Use the service for any discriminatory purpose</li>
            <li>Scrape, crawl, or programmatically extract data from Nestwise</li>
            <li>Misrepresent your identity or provide false information</li>
            <li>Attempt to reverse-engineer our matching algorithm or scoring system</li>
            <li>Use the platform for commercial purposes without written permission</li>
            <li>Violate any applicable law or regulation</li>
            <li>Interfere with the platform&apos;s operation or security</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>

          <h2>8. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:</p>
          <ul>
            <li>Nestwise&apos;s total liability to any user is capped at the amount you paid us in the 30 days preceding the claim (or $0 for free users).</li>
            <li>We are not liable for any indirect, incidental, consequential, special, or punitive damages, including lost housing, lost rent, moving costs, or missed lease opportunities.</li>
            <li>We are not responsible for the accuracy of third-party listings or actions taken by landlords.</li>
          </ul>
          <div className="attorney-note">⚠️ Attorney review recommended: California courts may limit enforceability of liability caps in consumer contracts. Review for compliance with California Consumer Legal Remedies Act (CLRA).</div>

          <h2>9. Intellectual Property</h2>
          <p>Nestwise owns all rights to its platform, including but not limited to: the user interface design, neighborhood tier ratings, match-scoring algorithm, proprietary data compilations, and all original written content. You may not copy, reproduce, or distribute any part of the Nestwise platform without written permission.</p>
          <p>Third-party listing data displayed on Nestwise remains the property of its original sources.</p>

          <h2>10. Account Termination</h2>
          <p>You may cancel your account at any time. We reserve the right to suspend or terminate your account without notice if you violate these terms, engage in fraudulent activity, or if we discontinue the service. No refunds are provided for partial subscription periods unless required by law.</p>

          <h2>11. Binding Arbitration &amp; Class Action Waiver</h2>
          <p>Any dispute arising from or relating to these Terms or your use of Nestwise will be resolved by binding individual arbitration administered by JAMS under its Streamlined Arbitration Rules, not by a court. <strong>You waive your right to a jury trial and to participate in any class action.</strong> Arbitration will take place in San Francisco, California.</p>
          <div className="attorney-note">⚠️ Attorney review strongly recommended: California has specific rules on arbitration clauses in consumer contracts. Ensure this clause complies with California law and is properly disclosed at sign-up.</div>

          <h2>12. Governing Law</h2>
          <p>These Terms are governed by the laws of the State of California, without regard to its conflict of law provisions. Any disputes not subject to arbitration will be brought in the state or federal courts located in San Francisco County, California.</p>

          <h2>13. Subscription &amp; Billing</h2>
          <p>Nestwise offers paid subscription plans billed through Stripe. By subscribing, you authorize recurring charges to your payment method. You may cancel at any time through your account settings. Cancellation takes effect at the end of the current billing period. We do not provide prorated refunds.</p>

          <h2>14. Contact</h2>
          <p>Questions about these Terms? Contact us at:<br />
          <strong>Nestwise</strong><br />
          San Francisco, CA<br />
          Email: <a href="mailto:hello@nestwise-sf.com" style={{ color: '#c9a84c' }}>hello@nestwise-sf.com</a></p>

          <hr className="legal-divider" />
          <p style={{ fontSize: '12px', color: 'rgba(240,235,224,0.3)' }}>
            <em>This document was drafted with AI assistance and is not a substitute for advice from a licensed attorney. Nestwise recommends having these terms reviewed by a California-licensed attorney before accepting paying users.</em>
          </p>
        </div>
      </div>
    </>
  );
}
