'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useApp } from '@/lib/context';
import { toggle } from '@/lib/utils';
import { SF_NEIGHBORHOODS, UNIT_TYPES, PET_OPTIONS, AMENITIES, ALERT_TIMES } from '@/lib/data';

export default function CriteriaPage() {
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [promoCode, setPromoCode]             = React.useState('');
  const [promoError, setPromoError]           = React.useState('');
  const [showPromoInput, setShowPromoInput]   = React.useState(false);
  const {
    user,
    setAuthOpen,
    setAuthMode,
    setShowSuccess,
    minRent, setMinRent,
    maxRent, setMaxRent,
    beds, setBeds,
    hoods, setHoods,
    pet, setPet,
    amenities, setAmenities,
    alertTimes, setAlertTimes,
    instantAlerts, setInstantAlerts,
    digest, setDigest,
    email, setEmail,
  } = useApp();

  async function handleStartSearch() {
    if (!email) {
      setAuthMode('signup');
      setAuthOpen(true);
      return;
    }

    setCheckoutLoading(true);
    setPromoError('');

    // If promo code entered, try to redeem it first
    if (promoCode.trim()) {
      try {
        const res = await fetch('/api/redeem-promo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: promoCode.trim() }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Valid code — skip Stripe, go straight to search
          router.push('/search');
          return;
        } else {
          setPromoError(data.error || 'Invalid or expired code');
          setCheckoutLoading(false);
          return;
        }
      } catch {
        setPromoError('Could not verify code. Please try again.');
        setCheckoutLoading(false);
        return;
      }
    }

    // No promo code — proceed to Stripe
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Something went wrong. Please try again.');
        setCheckoutLoading(false);
      }
    } catch {
      alert('Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="criteria-page">
      <Nav />

      {/* Hero */}
      <div className="criteria-hero">
        <div className="criteria-location">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1C4.07 1 2.5 2.57 2.5 4.5c0 2.8 3.5 6.5 3.5 6.5s3.5-3.7 3.5-6.5C9.5 2.57 7.93 1 6 1zm0 4.75a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
              fill="currentColor"
            />
          </svg>
          San Francisco, CA
        </div>
        <h1 className="criteria-title">Tell us exactly what you need.</h1>
        <p className="criteria-sub">
          Every detail you add sharpens your results — and reduces the noise.
        </p>
      </div>

      {/* Cards */}
      <div className="criteria-body">

        {/* Budget */}
        <div className="card">
          <div className="card-eyebrow">Budget</div>
          <div className="card-title">Monthly Rent Range</div>
          <div className="budget-row">
            <div className="input-group">
              <label>Minimum</label>
              <input
                type="number"
                value={minRent}
                onChange={(e) => setMinRent(Number(e.target.value))}
              />
            </div>
            <div className="budget-sep">—</div>
            <div className="input-group">
              <label>Maximum</label>
              <input
                type="number"
                value={maxRent}
                onChange={(e) => setMaxRent(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Unit type */}
        <div className="card">
          <div className="card-eyebrow">Size</div>
          <div className="card-title">Unit Type</div>
          <div className="pill-grid">
            {UNIT_TYPES.map((type) => (
              <button
                key={type}
                className={`pill${beds.includes(type) ? ' on' : ''}`}
                onClick={() => setBeds(toggle(beds, type))}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Neighborhoods */}
        <div className="card">
          <div className="card-eyebrow">Location</div>
          <div className="card-title">Preferred Neighborhoods</div>
          <div className="card-desc">
            Select all neighborhoods you'd consider. Top-tier picks are prioritized
            in your matches.
          </div>
          <div className="hood-grid">
            {SF_NEIGHBORHOODS.map((hood) => (
              <button
                key={hood.name}
                className={`hood-card${hoods.includes(hood.name) ? ' on' : ''}`}
                onClick={() => setHoods(toggle(hoods, hood.name))}
              >
                <div className="hood-name">{hood.name}</div>
                <div className="hood-desc">{hood.desc}</div>
                <div className={`hood-tier ${hood.tier}`}>
                  {hood.tier === 'top'
                    ? '★ Top Priority'
                    : hood.tier === 'secondary'
                    ? '◆ Secondary'
                    : '◇ Conditional'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pet policy */}
        <div className="card">
          <div className="card-eyebrow">Pets</div>
          <div className="card-title">Dog Policy</div>
          <div className="pet-grid">
            {PET_OPTIONS.map((option) => (
              <button
                key={option.id}
                className={`pet-option${pet === option.id ? ' on' : ''}`}
                onClick={() => setPet(option.id)}
              >
                <div className="pet-icon">{option.icon}</div>
                <div className="pet-label">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="card">
          <div className="card-eyebrow">Must-Haves</div>
          <div className="card-title">Amenities</div>
          <div className="pill-grid">
            {AMENITIES.map((amenity) => (
              <button
                key={amenity}
                className={`pill${amenities.includes(amenity) ? ' on-gold' : ''}`}
                onClick={() => setAmenities(toggle(amenities, amenity))}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="card-eyebrow">Alerts</div>
          <div className="card-title">How often should we notify you?</div>
          <div className="card-desc">
            Stay on top of new matches without inbox overload.
          </div>

          {/* Paid feature label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', color: '#c9a84c', marginBottom: '20px',
            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '4px', padding: '5px 10px',
          }}>
            ✓ Included with your subscription ($29/mo)
          </div>

          {/* Alert frequency cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              {
                id: 'daily',
                label: 'Daily digest',
                desc: 'One email per day with all new matches',
                onClick: () => { setDigest(true); setInstantAlerts(false); setAlertTimes(['8:00 AM']); },
                active: digest && !instantAlerts,
              },
              {
                id: 'twice_daily',
                label: 'Twice daily',
                desc: 'Morning and evening roundup',
                onClick: () => { setDigest(true); setInstantAlerts(false); setAlertTimes(['8:00 AM', '6:00 PM']); },
                active: digest && !instantAlerts && alertTimes.length === 2,
              },
              {
                id: 'instant',
                label: 'As listings drop',
                desc: 'Instant alert within 1 hour of posting',
                onClick: () => { setInstantAlerts(true); setDigest(false); setAlertTimes([]); },
                active: instantAlerts,
              },
            ].map((option) => (
              <button
                key={option.id}
                onClick={option.onClick}
                style={{
                  background: option.active ? 'rgba(201,168,76,0.08)' : 'rgba(240,235,224,0.03)',
                  border: `1px solid ${option.active ? '#c9a84c' : 'rgba(240,235,224,0.12)'}`,
                  borderRadius: '10px',
                  padding: '16px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <div style={{
                  fontSize: '13px', fontWeight: 600,
                  color: option.active ? '#c9a84c' : '#f0ebe0',
                  marginBottom: '6px',
                }}>
                  {option.active && <span style={{ marginRight: '4px' }}>✓</span>}
                  {option.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(240,235,224,0.45)',
                  lineHeight: 1.5,
                }}>
                  {option.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Advanced: delivery time picker (only shown for digest modes) */}
          {digest && !instantAlerts && (
            <div style={{ marginTop: '4px' }}>
              <div className="toggle-label" style={{ marginBottom: '4px' }}>
                Custom delivery times
              </div>
              <div className="toggle-desc" style={{ marginBottom: '8px' }}>
                Fine-tune exactly when you get your digest
              </div>
              <div className="time-grid">
                {ALERT_TIMES.map((t) => (
                  <button
                    key={t}
                    className={`time-btn${alertTimes.includes(t) ? ' on' : ''}`}
                    onClick={() => setAlertTimes(toggle(alertTimes, t))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="card">
          <div className="card-eyebrow">Contact</div>
          <div className="card-title">Alert Email</div>
          <div className="card-desc">
            Where should we send your matches? You can update this any time.
          </div>
          <div className="email-row">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button">Save</button>
          </div>
        </div>

      </div>

      {/* Fixed bottom CTA bar */}
      <div className="cta-bar">
        <div className="cta-bar-meta">
          <strong>{hoods.length}</strong> neighborhoods &middot;{' '}
          <strong>
            ${minRent.toLocaleString()}–${maxRent.toLocaleString()}
          </strong>{' '}
          &middot; <strong>{beds.join(', ') || 'Any size'}</strong>
        </div>
        {/* Promo code */}
        <div style={{ marginBottom: '12px' }}>
          {!showPromoInput ? (
            <button
              type="button"
              onClick={() => setShowPromoInput(true)}
              style={{ background: 'none', border: 'none', color: 'rgba(240,235,224,0.5)', fontSize: '13px', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
            >
              Have a referral code?
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Enter referral code"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(240,235,224,0.2)', background: 'rgba(255,255,255,0.05)', color: '#f0ebe0', fontSize: '14px', letterSpacing: '0.05em' }}
              />
            </div>
          )}
          {promoError && <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px' }}>{promoError}</p>}
        </div>

        <button className="btn-primary" onClick={handleStartSearch} disabled={checkoutLoading}>
          {checkoutLoading ? (promoCode ? 'Verifying code…' : 'Redirecting to checkout…') : 'Start My Search →'}
        </button>
      </div>
    </div>
  );
}
