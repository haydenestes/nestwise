'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState('');

  async function handleAccess(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: '460px', width: '100%', textAlign: 'center' }}>

          <Link href="/" style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none', display: 'block', marginBottom: '48px' }}>Nestwise</Link>

          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '42px', fontWeight: 300, fontStyle: 'italic', color: '#f0ebe0', lineHeight: 1.15, marginBottom: '20px' }}>
            Nestwise isn&apos;t for everyone.
          </h1>

          <p style={{ fontSize: '15px', color: 'rgba(240,235,224,0.6)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '380px', margin: '0 auto 36px' }}>
            We limit access so our members actually win listings. If it was free, your edge disappears.
          </p>

          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '28px', marginBottom: '28px' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#c9a84c', marginBottom: '4px' }}>$29</div>
            <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.4)', marginBottom: '20px' }}>per month · cancel anytime</div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              {[
                'Scan 6+ SF sources in real time',
                'Email alerts within minutes of a new match',
                'Pet-friendly filter, neighborhood scoring',
                'Application head-start pre-fill',
              ].map(f => (
                <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ color: '#c9a84c', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '13px', color: 'rgba(240,235,224,0.7)' }}>{f}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAccess}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com"
                style={{ width: '100%', background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.12)', borderRadius: '4px', padding: '11px 14px', color: '#f0ebe0', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none', marginBottom: '10px' }}
              />
              <button type="submit" disabled={loading} style={{
                width: '100%', background: '#c9a84c', color: '#0e0c0a', border: 'none',
                borderRadius: '4px', fontSize: '12px', fontWeight: 500,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                {loading ? 'Redirecting…' : 'Get Access — $29/mo'}
              </button>
            </form>
          </div>

          <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.25)' }}>
            Not ready yet?{' '}
            <Link href="/waitlist" style={{ color: 'rgba(201,168,76,0.5)', textDecoration: 'none' }}>Join the waitlist →</Link>
          </div>
        </div>
      </div>
    </>
  );
}
