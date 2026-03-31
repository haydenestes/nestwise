'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

export default function WaitlistPage() {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(0);
  const [refCode, setRefCode]   = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setReferredBy(params.get('ref') || '');
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await getSupabase()
      .from('waitlist')
      .insert({ email, referred_by: referredBy || null })
      .select('position, referral_code')
      .single();

    if (error) {
      if (error.code === '23505') {
        setError('That email is already on the waitlist.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
      return;
    }
    setPosition(data.position);
    setRefCode(data.referral_code);
    setSubmitted(true);
    setLoading(false);
  }

  function copyLink() {
    const url = `https://nestwise-sf.vercel.app/waitlist?ref=${refCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const shareUrl = `https://nestwise-sf.vercel.app/waitlist?ref=${refCode}`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(240,235,224,0.07)' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <Link href="/signin" style={{ fontSize: '13px', color: 'rgba(240,235,224,0.45)', textDecoration: 'none' }}>Sign in</Link>
        </nav>

        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '72px 24px 80px', textAlign: 'center' }}>

          {!submitted ? (
            <>
              <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '16px' }}>Early Access</div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#f0ebe0', lineHeight: 1.1, marginBottom: '16px' }}>
                Get early access<br />before we launch.
              </h1>
              <p style={{ fontSize: '16px', color: 'rgba(240,235,224,0.55)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '420px', margin: '0 auto 36px' }}>
                Join SF renters who are already ahead of the market. <strong style={{ color: 'rgba(240,235,224,0.85)' }}>Founding members get their first month free.</strong>
              </p>

              {referredBy && (
                <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '6px', padding: '10px 16px', marginBottom: '24px', fontSize: '13px', color: '#c9a84c' }}>
                  ✦ You were referred — you&apos;ll jump ahead in line automatically.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="your@email.com"
                  style={{ flex: 1, background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.12)', borderRadius: '4px', padding: '12px 14px', color: '#f0ebe0', fontSize: '14px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                />
                <button type="submit" disabled={loading} style={{
                  background: '#c9a84c', color: '#0e0c0a', border: 'none', borderRadius: '4px',
                  padding: '12px 20px', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                }}>
                  {loading ? '...' : 'Join waitlist'}
                </button>
              </form>
              {error && <div style={{ color: '#f87171', fontSize: '13px', marginBottom: '16px' }}>{error}</div>}

              {/* Social proof */}
              <div style={{ fontSize: '13px', color: 'rgba(240,235,224,0.35)', marginBottom: '48px' }}>
                247 SF renters already on the list
              </div>

              {/* Perks */}
              <div style={{ borderTop: '1px solid rgba(240,235,224,0.07)', paddingTop: '40px' }}>
                <div style={{ fontSize: '11px', letterSpacing: '0.12em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '20px' }}>Founding Member Perks</div>
                {[
                  { icon: '✦', text: 'First month free — founding member discount' },
                  { icon: '✦', text: 'Founding member badge on your account' },
                  { icon: '✦', text: 'Priority alerts before public launch' },
                  { icon: '✦', text: 'Direct line to the founder' },
                ].map(p => (
                  <div key={p.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', textAlign: 'left' }}>
                    <span style={{ color: '#c9a84c', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>{p.icon}</span>
                    <span style={{ fontSize: '14px', color: 'rgba(240,235,224,0.65)', lineHeight: 1.5 }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Success state */}
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '40px', fontWeight: 300, color: '#f0ebe0', marginBottom: '12px' }}>
                You&apos;re on the list.
              </h1>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '64px', fontWeight: 300, color: '#c9a84c', margin: '8px 0 4px' }}>
                #{position}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(240,235,224,0.45)', marginBottom: '36px' }}>
                Your spot on the waitlist
              </div>

              {/* Referral */}
              <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '10px', padding: '24px', marginBottom: '32px' }}>
                <div style={{ fontSize: '13px', color: '#c9a84c', fontWeight: 500, marginBottom: '6px' }}>Move up the list</div>
                <div style={{ fontSize: '13px', color: 'rgba(240,235,224,0.55)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Share your referral link. Every friend who joins moves you up <strong style={{ color: '#c9a84c' }}>50 spots</strong>.
                </div>
                <div style={{ background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.1)', borderRadius: '4px', padding: '10px 12px', fontSize: '12px', color: 'rgba(240,235,224,0.5)', fontFamily: 'monospace', marginBottom: '12px', wordBreak: 'break-all' }}>
                  nestwise-sf.vercel.app/waitlist?ref={refCode}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button onClick={copyLink} style={{
                    background: copied ? 'rgba(74,222,128,0.15)' : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${copied ? 'rgba(74,222,128,0.4)' : 'rgba(201,168,76,0.3)'}`,
                    color: copied ? '#4ade80' : '#c9a84c',
                    borderRadius: '4px', padding: '8px 16px', fontSize: '12px',
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                    {copied ? '✓ Copied!' : '⧉ Copy link'}
                  </button>
                  <a href={`https://twitter.com/intent/tweet?text=Found%20a%20tool%20that%20scans%20every%20SF%20rental%20listing%20before%20anyone%20else.%20Early%20access%20here%3A%20${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noreferrer"
                    style={{ background: 'rgba(240,235,224,0.04)', border: '1px solid rgba(240,235,224,0.12)', color: 'rgba(240,235,224,0.6)', borderRadius: '4px', padding: '8px 16px', fontSize: '12px', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
                    𝕏 Share on X
                  </a>
                </div>
              </div>

              <Link href="/search" style={{ color: '#c9a84c', fontSize: '13px', textDecoration: 'none' }}>
                Browse listings now →
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
