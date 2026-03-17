'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import { useApp } from '@/lib/context';
import { toggle } from '@/lib/utils';
import { SF_NEIGHBORHOODS, UNIT_TYPES, PET_OPTIONS, AMENITIES, ALERT_TIMES } from '@/lib/data';

export default function CriteriaPage() {
  const router = useRouter();
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

  function handleStartSearch() {
    if (!user) {
      setAuthMode('signup');
      setAuthOpen(true);
    } else {
      setShowSuccess(true);
      // SuccessOverlay in Providers handles the 2.4s delay + router.push('/dashboard')
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
          <div className="card-title">Notification Preferences</div>

          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">Instant alerts</div>
              <div className="toggle-desc">
                Get notified within minutes of a new match going live
              </div>
            </div>
            <button
              className={`switch${instantAlerts ? ' on' : ''}`}
              onClick={() => setInstantAlerts(!instantAlerts)}
            />
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">Daily digest</div>
              <div className="toggle-desc">
                Summary of all new matches sent once per day
              </div>
            </div>
            <button
              className={`switch${digest ? ' on' : ''}`}
              onClick={() => setDigest(!digest)}
            />
          </div>

          <div style={{ marginTop: '8px' }}>
            <div className="toggle-label" style={{ marginBottom: '4px' }}>
              Alert delivery times
            </div>
            <div className="toggle-desc" style={{ marginBottom: '0' }}>
              Choose when you want to receive your alert digests
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
        <button className="btn-primary" onClick={handleStartSearch}>
          Start My Search →
        </button>
      </div>
    </div>
  );
}
