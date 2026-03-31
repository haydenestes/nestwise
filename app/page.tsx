'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NEIGHBORHOODS = ['Marina', 'Mission', 'Noe Valley', 'SOMA', 'Pacific Heights', 'Hayes Valley'];

export default function LandingPage() {
  const router = useRouter();
  const [activeHood, setActiveHood] = useState('Pacific Heights');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hero-root {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: #0e0c0a;
          font-family: 'Inter', sans-serif;
        }

        /* ── LEFT COLUMN ── */
        .hero-left {
          display: flex;
          flex-direction: column;
          padding: 36px 48px 48px;
          position: relative;
          z-index: 2;
        }

        /* Nav */
        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 72px;
        }
        .hero-logo {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: #c9a84c;
          text-transform: uppercase;
        }
        .hero-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .hero-nav-links a {
          font-size: 12px;
          font-weight: 300;
          color: rgba(240,235,224,0.55);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .hero-nav-links a:hover { color: rgba(240,235,224,0.9); }
        .hero-signin {
          border: 1px solid rgba(201,168,76,0.3) !important;
          padding: 4px 12px !important;
          border-radius: 3px;
          color: rgba(240,235,224,0.7) !important;
        }
        .hero-signin:hover { color: #c9a84c !important; border-color: #c9a84c !important; }

        /* Headline */
        .hero-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .hero-eyebrow {
          font-size: 10px;
          letter-spacing: 0.22em;
          color: #c9a84c;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 400;
        }
        .hero-h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 56px;
          font-weight: 300;
          color: #f0ebe0;
          line-height: 1.12;
          margin-bottom: 24px;
        }
        .hero-h1 em { font-style: italic; color: #c9a84c; }
        .hero-sub {
          font-size: 14px;
          font-weight: 300;
          color: rgba(240,235,224,0.6);
          max-width: 340px;
          line-height: 1.65;
          margin-bottom: 32px;
        }
        .hero-sub strong { color: rgba(240,235,224,0.9); font-weight: 400; }

        /* Pills */
        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 36px;
        }
        .hero-pill {
          border: 1px solid rgba(201,168,76,0.25);
          color: rgba(240,235,224,0.55);
          border-radius: 20px;
          font-size: 11px;
          padding: 5px 12px;
          background: transparent;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.18s;
        }
        .hero-pill:hover, .hero-pill.active {
          border-color: #c9a84c;
          color: #c9a84c;
          background: rgba(201,168,76,0.08);
        }

        /* CTA */
        .hero-cta { display: flex; align-items: center; gap: 20px; margin-bottom: 56px; }
        .btn-primary-hero {
          background: #c9a84c;
          color: #0e0c0a;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 12px 24px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          transition: background 0.18s;
        }
        .btn-primary-hero:hover { background: #e8c97a; }
        .btn-ghost-hero {
          background: none;
          border: none;
          color: rgba(240,235,224,0.45);
          font-size: 12px;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: color 0.18s;
        }
        .btn-ghost-hero:hover { color: rgba(240,235,224,0.8); }

        /* Stats */
        .hero-stats {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(240,235,224,0.07);
          padding-top: 28px;
        }
        .hero-stat {
          flex: 1;
          padding-right: 24px;
          border-right: 1px solid rgba(240,235,224,0.1);
          margin-right: 24px;
        }
        .hero-stat:last-child { border-right: none; margin-right: 0; padding-right: 0; }
        .stat-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 28px;
          color: #c9a84c;
          font-weight: 300;
          line-height: 1;
          margin-bottom: 4px;
        }
        .stat-lbl {
          font-size: 10px;
          color: rgba(240,235,224,0.4);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-weight: 400;
        }

        /* ── RIGHT COLUMN ── */
        .hero-right {
          position: relative;
          overflow: hidden;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .hero-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, #0e0c0a 0%, transparent 40%);
          pointer-events: none;
        }

        /* Floating cards */
        .float-card-1 {
          position: absolute;
          top: 32px;
          right: 28px;
          background: rgba(14,12,10,0.75);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 6px;
          padding: 10px 14px;
          backdrop-filter: blur(8px);
        }
        .float-card-1-top {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #f0ebe0;
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          margin-bottom: 4px;
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4ade80;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .float-card-1-sub {
          font-size: 10px;
          color: rgba(240,235,224,0.4);
          font-family: 'Inter', sans-serif;
        }

        .float-card-2 {
          position: absolute;
          bottom: 32px;
          right: 28px;
          background: rgba(14,12,10,0.82);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px;
          padding: 12px 14px;
          width: 200px;
          backdrop-filter: blur(8px);
        }
        .float-card-2-label {
          font-size: 9px;
          color: #c9a84c;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: 'Inter', sans-serif;
          margin-bottom: 10px;
        }
        .listing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid rgba(240,235,224,0.06);
          font-family: 'Inter', sans-serif;
        }
        .listing-row:last-of-type { border-bottom: none; }
        .listing-row-name { font-size: 11px; color: rgba(240,235,224,0.75); font-weight: 300; }
        .listing-row-price { font-size: 11px; color: #c9a84c; font-weight: 400; }
        .float-card-2-footer {
          margin-top: 8px;
          font-size: 9px;
          color: #86efac;
          font-family: 'Inter', sans-serif;
        }

        @media (max-width: 768px) {
          .hero-root { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .hero-left { padding: 28px 24px 40px; }
          .hero-h1 { font-size: 38px; }
        }
      `}</style>

      <div className="hero-root">
        {/* ── LEFT ── */}
        <div className="hero-left">
          {/* Nav */}
          <nav className="hero-nav">
            <div className="hero-logo">Nestwise</div>
            <div className="hero-nav-links">
              <a href="#">How it works</a>
              <Link href="/neighborhoods-hub" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(240,235,224,0.55)', textDecoration: 'none', letterSpacing: '0.04em' }}>Neighborhoods</Link>
              <Link href="/waitlist" style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(240,235,224,0.55)', textDecoration: 'none', letterSpacing: '0.04em' }}>Waitlist</Link>
              <Link href="/signin" className="hero-signin">Sign in</Link>
            </div>
          </nav>

          {/* Content */}
          <div className="hero-content">
            <div className="hero-eyebrow">San Francisco Rental Intelligence</div>
            <h1 className="hero-h1">
              Find your <em>perfect</em><br />
              SF home —<br />
              before anyone else.
            </h1>
            <p className="hero-sub">
              Stop checking 12 tabs. Nestwise scans{' '}
              <strong>every landlord, every platform</strong>{' '}
              — and surfaces only what matches you. No noise. Just your next home.
            </p>

            {/* Neighborhood pills */}
            <div className="hero-pills">
              {NEIGHBORHOODS.map((hood) => (
                <button
                  key={hood}
                  className={`hero-pill${activeHood === hood ? ' active' : ''}`}
                  onClick={() => setActiveHood(hood)}
                >
                  {hood}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hero-cta">
              <button className="btn-primary-hero" onClick={() => router.push('/search')}>
                Start my search →
              </button>
              <button className="btn-ghost-hero">See how it works</button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              {[
                { num: 'Full',  lbl: 'market coverage' },
                { num: '24/7',  lbl: 'real-time scanning' },
                { num: '3×',    lbl: 'faster than manual search' },
                { num: '400+',  lbl: 'SF renters this month' },
              ].map((s) => (
                <div key={s.lbl} className="hero-stat">
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Hunt badge */}
        <a href="https://www.producthunt.com" target="_blank" rel="noreferrer" style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 100, opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
          onMouseOver={e => (e.currentTarget.style.opacity = '1')}
          onMouseOut={e => (e.currentTarget.style.opacity = '0.7')}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=nestwise&theme=dark" alt="Nestwise on Product Hunt" style={{ width: '180px', height: 'auto' }} />
        </a>

        {/* ── RIGHT ── */}
        <div className="hero-right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="hero-img"
            src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80"
            alt="Golden Gate Bridge San Francisco"
          />
          <div className="hero-fade" />

          {/* Card 1 — top right */}
          <div className="float-card-1">
            <div className="float-card-1-top">
              <div className="pulse-dot" />
              23 new listings today
            </div>
            <div className="float-card-1-sub">Last updated 4 min ago</div>
          </div>

          {/* Card 2 — bottom right */}
          <div className="float-card-2">
            <div className="float-card-2-label">Latest Matches</div>
            {[
              { name: '2BR · Marina',      price: '$3,850' },
              { name: '1BR · Noe Valley',  price: '$2,975' },
              { name: 'Studio · Hayes',    price: '$2,200' },
            ].map((l) => (
              <div key={l.name} className="listing-row">
                <span className="listing-row-name">{l.name}</span>
                <span className="listing-row-price">{l.price}</span>
              </div>
            ))}
            <div className="float-card-2-footer">+ 4 new in last hour</div>
          </div>
        </div>
      </div>
    </>
  );
}
