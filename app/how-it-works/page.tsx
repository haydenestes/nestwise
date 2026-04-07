'use client';
export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';

const STEPS = [
  {
    num: '01',
    title: 'Tell us what you need',
    body: 'Set your neighborhoods, budget, bedroom count, pet policy, and move-in timeline. Takes 90 seconds.',
    icon: '⊙',
  },
  {
    num: '02',
    title: 'We scan everything — before you would',
    body: 'Nestwise monitors Craigslist, Chandler Properties, ReLISTO, J. Wavro, Gaetani, WCPM, and more — in real time, 24/7. Most listings appear on property manager sites before they ever hit Zillow.',
    icon: '⟳',
  },
  {
    num: '03',
    title: 'Only your matches surface',
    body: 'Every listing is scored against your exact criteria — neighborhood tier, budget fit, pet policy, laundry, and more. You only see listings that actually match. No noise.',
    icon: '✦',
  },
  {
    num: '04',
    title: 'You get alerted the moment it goes live',
    body: 'Email alerts go out the moment a strong match is found — not in a daily digest, but within minutes. The SF rental market moves in hours. So do we.',
    icon: '◎',
  },
  {
    num: '05',
    title: 'Apply before the competition shows up',
    body: 'Use the application head-start feature to pre-fill common rental application fields — income, references, move-in date — so you can respond in minutes, not days.',
    icon: '→',
  },
];

const SOURCES = [
  'Craigslist', 'Chandler Properties', 'ReLISTO', 'J. Wavro Associates',
  'Gaetani Real Estate', 'WCPM', 'Zillow (coming soon)', 'Redfin (coming soon)',
];

export default function HowItWorksPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        .hiw-nav { display: flex; align-items: center; justify-content: space-between; padding: 24px 48px; border-bottom: 1px solid rgba(240,235,224,0.07); }
        .hiw-nav-links { display: flex; gap: 20px; align-items: center; }
        .hiw-container { max-width: 720px; margin: 0 auto; padding: 64px 24px 80px; }
        .hiw-h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 48px; font-weight: 300; color: #f0ebe0; line-height: 1.1; margin-bottom: 16px; }
        .hiw-intro { font-size: 15px; color: rgba(240,235,224,0.55); line-height: 1.7; margin-bottom: 64px; max-width: 520px; }
        .hiw-steps { margin-bottom: 64px; }
        .hiw-step { display: flex; gap: 28px; margin-bottom: 40px; align-items: flex-start; }
        .hiw-step:last-child { margin-bottom: 0; }
        .hiw-cta-link { display: inline-block; background: #c9a84c; color: #0e0c0a; border-radius: 4px; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; padding: 14px 32px; text-decoration: none; }
        @media (max-width: 768px) {
          .hiw-nav { padding: 20px 20px; }
          .hiw-nav-links { display: none; }
          .hiw-container { padding: 36px 20px 60px; }
          .hiw-h1 { font-size: 30px; }
          .hiw-intro { font-size: 15px; margin-bottom: 40px; max-width: 100%; }
          .hiw-steps { margin-bottom: 40px; }
          .hiw-step { gap: 16px; margin-bottom: 28px; }
          .hiw-cta-link { display: block; text-align: center; padding: 16px 24px; min-height: 48px; }
        }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        <nav className="hiw-nav">
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <div className="hiw-nav-links">
            <Link href="/signup" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign up</Link>
            <Link href="/signin" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </nav>

        <div className="hiw-container">

          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '14px' }}>How Nestwise Works</div>
          <h1 className="hiw-h1">
            Find your SF apartment<br />before anyone else does.
          </h1>
          <p className="hiw-intro">
            The SF rental market is won and lost in hours. Nestwise gives you information before the competition — and tools to act faster when it matters.
          </p>

          {/* Steps */}
          <div className="hiw-steps">
            {STEPS.map((step, i) => (
              <div key={step.num} className="hiw-step">
                <div style={{ flexShrink: 0, width: '44px', height: '44px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '11px', color: '#c9a84c', letterSpacing: '0.05em' }}>
                  {step.num}
                </div>
                <div style={{ flex: 1, paddingTop: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: '#f0ebe0', marginBottom: '8px' }}>{step.title}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(240,235,224,0.6)', lineHeight: 1.7 }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Sources */}
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '10px', padding: '28px 32px', marginBottom: '56px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Sources We Monitor</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SOURCES.map(s => (
                <span key={s} style={{ fontSize: '12px', color: s.includes('coming') ? 'rgba(240,235,224,0.25)' : 'rgba(240,235,224,0.65)', border: `1px solid ${s.includes('coming') ? 'rgba(240,235,224,0.08)' : 'rgba(240,235,224,0.15)'}`, borderRadius: '20px', padding: '4px 12px' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/search" className="hiw-cta-link">
              Start my search →
            </Link>
            <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.3)', marginTop: '10px' }}>
              Free to try · No credit card required
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
