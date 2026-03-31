'use client';
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { NEIGHBORHOODS } from '@/lib/neighborhoodData';

const TIER_STYLE: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Iconic SF',        color: '#c9a84c', bg: 'rgba(201,168,76,0.1)' },
  2: { label: 'Neighborhood Soul', color: '#63b3ed', bg: 'rgba(99,179,237,0.08)' },
  3: { label: 'Local Favorite',   color: '#9ad7a3', bg: 'rgba(154,215,163,0.08)' },
};

export default function NeighborhoodsHub() {
  const tiers = [1, 2, 3] as const;
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0e0c0a; }
        .hood-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 48px; }
        @media(max-width:800px) { .hood-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:500px) { .hood-grid { grid-template-columns: 1fr; } }
        .hood-card { background: #161310; border: 1px solid rgba(240,235,224,0.08); border-radius: 8px; padding: 18px 20px; text-decoration: none; display: block; transition: border-color 0.15s; }
        .hood-card:hover { border-color: rgba(201,168,76,0.3); }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#0e0c0a', color: '#f0ebe0', fontFamily: 'Inter, sans-serif' }}>
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', borderBottom: '1px solid rgba(240,235,224,0.07)' }}>
          <Link href="/" style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.18em', color: '#c9a84c', textTransform: 'uppercase', textDecoration: 'none' }}>Nestwise</Link>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/waitlist" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.5)', textDecoration: 'none' }}>Join waitlist</Link>
            <Link href="/signin" style={{ fontSize: '12px', color: 'rgba(240,235,224,0.5)', textDecoration: 'none' }}>Sign in</Link>
          </div>
        </nav>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '56px 24px 80px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.22em', color: '#c9a84c', textTransform: 'uppercase', marginBottom: '12px' }}>Explore SF</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '48px', fontWeight: 300, color: '#f0ebe0', marginBottom: '8px' }}>SF Neighborhoods</h1>
          <p style={{ fontSize: '14px', color: 'rgba(240,235,224,0.5)', marginBottom: '48px', lineHeight: 1.6 }}>
            Browse rentals by neighborhood — each with real listings, average rents, and neighborhood intelligence.
          </p>

          {tiers.map(tier => {
            const hoods = NEIGHBORHOODS.filter(n => n.tier === tier);
            const s = TIER_STYLE[tier];
            return (
              <div key={tier}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '3px' }}>
                    Tier {tier} · {s.label}
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(240,235,224,0.07)' }} />
                </div>
                <div className="hood-grid">
                  {hoods.map(h => (
                    <Link key={h.slug} href={`/neighborhoods/${h.slug}`} className="hood-card">
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#f0ebe0', marginBottom: '4px' }}>{h.name}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(240,235,224,0.4)', marginBottom: '10px' }}>{h.bullets[0].slice(0, 60)}…</div>
                      <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '20px', color: '#c9a84c' }}>
                        ${h.avgRent.toLocaleString()}<span style={{ fontSize: '12px', color: 'rgba(240,235,224,0.35)' }}>/mo avg</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href="/search" style={{
              display: 'inline-block', background: '#c9a84c', color: '#0e0c0a',
              borderRadius: '4px', fontSize: '12px', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '12px 28px', textDecoration: 'none',
            }}>
              Search all neighborhoods →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
