'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

interface PaywallModalProps {
  onClose: () => void;
  message?: string;
}

export default function PaywallModal({ onClose, message }: PaywallModalProps) {
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  async function handleContinue() {
    if (promoCode.trim()) {
      setPromoLoading(true);
      setPromoError('');
      try {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        const res = await fetch('/api/redeem-promo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: promoCode.trim(), userId: user?.id }),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          router.push('/dashboard');
          return;
        } else {
          setPromoError(json.error || 'Invalid or expired code');
          setPromoLoading(false);
          return;
        }
      } catch {
        setPromoError('Something went wrong. Please try again.');
        setPromoLoading(false);
        return;
      }
    }
    // No promo code — proceed to signup/Stripe
    router.push('/signup');
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(14,12,10,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: '#161310',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: '14px',
        padding: '40px 36px',
        maxWidth: '520px',
        width: '100%',
        position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none',
          color: 'rgba(240,235,224,0.35)', fontSize: '18px',
          cursor: 'pointer', lineHeight: 1,
        }}>✕</button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '32px', fontWeight: 300,
            color: '#f0ebe0', marginBottom: '10px',
          }}>
            You found your matches.
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(240,235,224,0.55)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
            {message || 'Create an account to save listings, get real-time alerts, and unlock your application head-start.'}
          </div>
        </div>

        {/* Plan card */}
        <div style={{
          border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '10px',
          padding: '24px',
          background: 'rgba(201,168,76,0.04)',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '8px' }}>
            ★ Most Popular
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'Cormorant Garamond, Georgia, serif', fontWeight: 300, color: '#f0ebe0', marginBottom: '4px' }}>
            $29<span style={{ fontSize: '14px', color: 'rgba(240,235,224,0.45)' }}>/mo</span>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.5)', marginBottom: '20px' }}>Full Nestwise Access</div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            {[
              'Unlimited searches',
              'Save listings',
              'Real-time email alerts',
              'Application pre-fill',
              'Priority listing access',
            ].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ color: '#c9a84c', fontSize: '14px' }}>✓</span>
                <span style={{ fontSize: '13px', color: 'rgba(240,235,224,0.75)' }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Promo code section */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            {!showPromo ? (
              <button
                onClick={() => setShowPromo(true)}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(201,168,76,0.65)', fontSize: '12px',
                  cursor: 'pointer', textDecoration: 'underline',
                  fontFamily: 'Inter, sans-serif', padding: 0,
                }}
              >
                Have a referral code?
              </button>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.06em', color: 'rgba(240,235,224,0.5)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Referral Code
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                  placeholder="Enter code"
                  style={{
                    width: '100%',
                    background: 'rgba(240,235,224,0.04)',
                    border: '1px solid rgba(240,235,224,0.15)',
                    borderRadius: '4px',
                    padding: '9px 12px',
                    color: '#f0ebe0',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                />
                {promoError && (
                  <div style={{ fontSize: '12px', color: '#f87171', marginTop: '6px' }}>{promoError}</div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleContinue}
            disabled={promoLoading}
            style={{
              width: '100%',
              background: '#c9a84c',
              color: '#0e0c0a',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '13px',
              cursor: promoLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.18s',
              opacity: promoLoading ? 0.7 : 1,
            }}
            onMouseOver={e => { if (!promoLoading) e.currentTarget.style.background = '#e8c97a'; }}
            onMouseOut={e => { if (!promoLoading) e.currentTarget.style.background = '#c9a84c'; }}
          >
            {promoLoading ? 'Verifying…' : promoCode.trim() ? 'Apply Code →' : 'Start for $29/mo →'}
          </button>
        </div>

        {/* Free option */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: 'rgba(240,235,224,0.35)', fontSize: '13px',
            cursor: 'pointer', textDecoration: 'underline',
          }}>
            Continue browsing (view only)
          </button>
          <div style={{ fontSize: '11px', color: 'rgba(240,235,224,0.25)', marginTop: '10px' }}>
            No commitment. Cancel anytime.
          </div>
        </div>
      </div>
    </div>
  );
}
