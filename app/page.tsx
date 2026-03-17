'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing">
      {/* Left column */}
      <div className="landing-left">
        <div className="wordmark">NestWise</div>

        <div className="landing-eyebrow">San Francisco Rental Intelligence</div>

        <h1 className="landing-headline">
          Find your <em>perfect</em>
          <br />
          SF home — before
          <br />
          anyone else does.
        </h1>

        <p className="landing-body">
          NestWise monitors 10 curated sources in real time and surfaces only
          the listings that match your exact criteria — neighborhood, budget,
          pets, and more. No noise. Just your next home.
        </p>

        <button className="landing-cta" onClick={() => router.push('/criteria')}>
          Set my criteria
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="landing-trust">
          <div className="trust-item">
            <span className="trust-num">10</span>
            <span className="trust-label">curated sources monitored</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-num">24/7</span>
            <span className="trust-label">real-time scanning</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-num">3×</span>
            <span className="trust-label">faster than manual search</span>
          </div>
        </div>
      </div>

      {/* Right column — hero image */}
      <div className="landing-right">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="landing-right-img"
          src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=1600&q=85"
          alt="San Francisco skyline"
        />
        <div className="landing-right-overlay" />
        <div className="landing-right-overlay-bottom" />
      </div>
    </div>
  );
}
