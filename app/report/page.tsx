'use client';
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { NEIGHBORHOODS } from '@/lib/neighborhoodData';

const STATS = [
  { label: 'Median SF rent', value: '$3,965/mo', note: 'up 11% YoY' },
  { label: 'Vacancy rate',   value: '3.0%',      note: 'decade low' },
  { label: 'Fastest leasing', value: 'Marina',   note: 'Q1 2026' },
];

export default function ReportPage() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [neighborhood, setHood]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await getSupabase()
      .from('report_subscribers')
      .insert({ name, email, neighborhood });
    if (error) {
      setError(error.code === '23505' ? 'You\'re already subscribed!' : 'Something went wrong.');
      setLoading(false);
      return;
    }
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        select option { background: #161310; color: #f0ebe0; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(240,235,224,0.07)' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <Link href="/signin" style={{ fontSize: '13px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign in</Link>
        </nav>

        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '72px 24px 80px' }}>

          {/* Sample stats */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '48px' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ flex: 1, paddingRight: i < 2 ? '24px' : 0, marginRight: i < 2 ? '24px' : 0, borderRight: i < 2 ? '1px solid rgba(240,235,224,0.07)' : 'none' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', color: '#c9a84c', marginBottom: '2px' }}>{s.value}</div>
                <div style={{ fontSize: '11px', color: 'rgba(240,235,224,0.4)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                <div style={{ fontSize: '11px', color: 'rgba(240,235,224,0.25)' }}>{s.note}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '12px' }}>Free Monthly Report</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '44px', fontWeight: 300, color: '#f0ebe0', lineHeight: 1.1, marginBottom: '14px' }}>
            The SF Rental Pulse
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(240,235,224,0.55)', lineHeight: 1.65, marginBottom: '36px' }}>
            Monthly data on every SF neighborhood — vacancy rates, price movements, fastest-moving listings. Free, every month.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name"
                  style={{ width: '100%', background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.1)', borderRadius: '4px', padding: '11px 14px', color: '#f0ebe0', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                  style={{ width: '100%', background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.1)', borderRadius: '4px', padding: '11px 14px', color: '#f0ebe0', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <select value={neighborhood} onChange={e => setHood(e.target.value)} required
                  style={{ width: '100%', background: '#161310', border: '1px solid rgba(240,235,224,0.1)', borderRadius: '4px', padding: '11px 14px', color: neighborhood ? '#f0ebe0' : 'rgba(240,235,224,0.35)', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}>
                  <option value="" disabled>Which neighborhood are you searching in?</option>
                  {NEIGHBORHOODS.map(n => <option key={n.slug} value={n.name}>{n.name}</option>)}
                </select>
              </div>
              {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{
                width: '100%', background: '#c9a84c', color: '#0e0c0a', border: 'none',
                borderRadius: '4px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                {loading ? 'Subscribing…' : 'Get the free report →'}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✦</div>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '28px', fontWeight: 300, color: '#f0ebe0', marginBottom: '10px' }}>You&apos;re subscribed.</div>
              <div style={{ fontSize: '14px', color: 'rgba(240,235,224,0.5)', marginBottom: '28px' }}>First report arrives next month. We&apos;ll email you at {email}.</div>
              <a
                href="/nestwise-rental-pulse-sample.pdf"
                download
                style={{
                  display: 'inline-block', background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c',
                  borderRadius: '4px', padding: '10px 20px', fontSize: '13px',
                  textDecoration: 'none', marginBottom: '16px',
                }}>
                ↓ Download sample report
              </a>
              <div style={{ marginTop: '16px' }}>
                <Link href="/search" style={{ color: '#c9a84c', fontSize: '13px', textDecoration: 'none' }}>Browse listings now →</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
