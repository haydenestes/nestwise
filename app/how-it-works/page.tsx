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
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(240,235,224,0.07)' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link href="/waitlist" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Waitlist</Link>
            <Link href="/signin" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px 80px' }}>

          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '14px' }}>How Nestwise Works</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#f0ebe0', lineHeight: 1.1, marginBottom: '16px' }}>
            Find your SF apartment<br />before anyone else does.
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(240,235,224,0.55)', lineHeight: 1.7, marginBottom: '64px', maxWidth: '520px' }}>
            The SF rental market is won and lost in hours. Nestwise gives you information before the competition — and tools to act faster when it matters.
          </p>

          {/* Steps */}
          <div style={{ marginBottom: '64px' }}>
            {STEPS.map((step, i) => (
              <div key={step.num} style={{ display: 'flex', gap: '28px', marginBottom: i < STEPS.length - 1 ? '40px' : 0, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: '48px', height: '48px', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '11px', color: '#c9a84c', letterSpacing: '0.05em' }}>
                  {step.num}
                </div>
                <div style={{ flex: 1, paddingTop: '10px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#f0ebe0', marginBottom: '8px' }}>{step.title}</div>
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
            <Link href="/search" style={{
              display: 'inline-block', background: '#c9a84c', color: '#0e0c0a',
              borderRadius: '4px', fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '14px 32px', textDecoration: 'none', marginBottom: '14px',
            }}>
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
