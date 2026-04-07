'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useApp } from '@/lib/context';
import { toggle } from '@/lib/utils';
import { SF_NEIGHBORHOODS, UNIT_TYPES, PET_OPTIONS, AMENITIES, ALERT_TIMES } from '@/lib/data';

export default function CriteriaPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [step, setStep] = React.useState<'criteria' | 'notifications'>('criteria');
  const [instantAlertsLocal, setInstantAlertsLocal] = React.useState(true);
  const [digestEnabledLocal, setDigestEnabledLocal] = React.useState(true);
  const [selectedTimesLocal, setSelectedTimesLocal] = React.useState<string[]>(['daily']);
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

  async function handleContinue() {
    if (!email) {
      setAuthMode('signup');
      setAuthOpen(true);
      return;
    }

    setStep('notifications');
  }

  async function handleFinish() {
    setLoading(true);
    try {
      // Save preferences to user profile
      const res = await fetch('/api/save-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          criteria: { minRent, maxRent, beds, neighborhoods: hoods, pet, amenities },
          notifications: {
            instant_alerts: instantAlertsLocal,
            digest_enabled: digestEnabledLocal,
            digest_times: selectedTimesLocal,
          },
        }),
      });

      if (res.ok) {
        router.push('/success');
      } else {
        alert('Error saving preferences. Please try again.');
      }
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="criteria-page" style={{ background: '#f8f7f5', color: '#1e1e1e', minHeight: '100vh' }}>
      <style>{`
        .criteria-page { background: #f8f7f5; color: #1e1e1e; }
        .criteria-hero { background: #f8f7f5; }
        .criteria-title { color: #1e1e1e; }
        .criteria-sub { color: #555; }
        .card { background: #ffffff; border: 1px solid #e5e0d8; color: #1e1e1e; }
        .card-eyebrow { color: #999; }
        .card-title { color: #1e1e1e; }
        .card-desc { color: #666; }
        .pill { background: rgba(30,30,30,0.08); border: 1px solid #ddd; color: #1e1e1e; }
        .pill.on { background: #6b8f71; color: #fff; border-color: #6b8f71; }
        .hood-card { background: #fff; border: 1px solid #ddd; color: #1e1e1e; }
        .hood-card.on { border-color: #6b8f71; background: #f5f9f7; }
        .hood-name { color: #1e1e1e; }
        .hood-desc { color: #666; }
        input, select { background: #fff; color: #1e1e1e; border: 1px solid #ddd; }
        input::placeholder { color: #999; }
        .cta-bar { background: #fff; border-top: 1px solid #e5e0d8; color: #1e1e1e; }
        .cta-bar-meta { color: #555; }
      `}</style>
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
        {step === 'criteria' ? (
          <>
            <div className="cta-bar-meta">
              <strong>{hoods.length}</strong> neighborhoods &middot;{' '}
              <strong>
                ${minRent.toLocaleString()}–${maxRent.toLocaleString()}
              </strong>{' '}
              &middot; <strong>{beds.join(', ') || 'Any size'}</strong>
            </div>
            <button className="btn-primary" onClick={handleContinue} disabled={loading} style={{ background: '#6b8f71' }}>
              {loading ? 'Loading…' : 'Continue →'}
            </button>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              <div style={{ borderTop: '1px solid #e5e0d8', paddingTop: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: '#1e1e1e' }}>
                  Notification Preferences
                </div>

                {/* Instant alerts toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#1e1e1e' }}>
                    Instant alerts for 90+ match score
                  </label>
                  <input
                    type="checkbox"
                    checked={instantAlertsLocal}
                    onChange={(e) => setInstantAlertsLocal(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Digest toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <label style={{ fontSize: '14px', fontWeight: 500, color: '#1e1e1e' }}>
                    Digest emails
                  </label>
                  <input
                    type="checkbox"
                    checked={digestEnabledLocal}
                    onChange={(e) => setDigestEnabledLocal(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </div>

                {/* Digest times */}
                {digestEnabledLocal && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e0d8' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '12px', color: '#666' }}>
                      When to receive digests:
                    </label>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {['9am', '5pm', 'daily', 'twice-daily'].map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            if (selectedTimesLocal.includes(time)) {
                              setSelectedTimesLocal(selectedTimesLocal.filter(t => t !== time));
                            } else {
                              setSelectedTimesLocal([...selectedTimesLocal, time]);
                            }
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '6px',
                            border: selectedTimesLocal.includes(time) ? '1px solid #6b8f71' : '1px solid #ddd',
                            background: selectedTimesLocal.includes(time) ? '#6b8f71' : '#fff',
                            color: selectedTimesLocal.includes(time) ? '#fff' : '#1e1e1e',
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}
                        >
                          {time === '9am' ? '9 AM' : time === '5pm' ? '5 PM' : time === 'daily' ? 'Daily' : 'Twice daily'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                className="btn-primary"
                onClick={handleFinish}
                disabled={loading}
                style={{ width: '100%', background: '#6b8f71' }}
              >
                {loading ? 'Setting up…' : 'Start Receiving Alerts →'}
              </button>
              <button
                onClick={() => setStep('criteria')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#999',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
